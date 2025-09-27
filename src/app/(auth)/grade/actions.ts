"use server";

import { Console, Effect, Option } from "effect";
import { AirtableDb, fetchHackerReviews } from "@/lib/utils/airtable";
import { calculatePriorityStatus } from "@/lib/utils/util";
import type { ApplicationEncoded, ReviewEncoded } from "@/schema/airtable";

export async function submitApplicationDecision(
	applicationId: Pick<ApplicationEncoded, "id">,
	review: Pick<
		ReviewEncoded,
		"email" | "created_at" | "reviewer_id" | "decision"
	>,
) {
	Effect.gen(function* () {
		const db = yield* AirtableDb;
		const applicationsTable = db.table("Applications");
		const reviewsTable = db.table("Reviews");

		const reviews = yield* fetchHackerReviews;
		const decisions = {
			accept: review.decision === "accept" ? 1 : 0,
			reject: review.decision === "reject" ? 1 : 0,
		};
		for (const { decision, email } of reviews) {
			if (review.email === email) {
				if (decision === "accept") {
					decisions.accept += 1;
				} else if (decision === "reject") {
					decisions.reject += 1;
				}
			}

			if (decisions.accept > 2 || decisions.reject > 1) {
				return;
			}
		}

		const status = calculatePriorityStatus(decisions);
		const insertDecision = Option.match(status, {
			onNone: () => Effect.void,
			onSome: (status) =>
				Effect.tryPromise(() =>
					applicationsTable.update([
						{
							id: applicationId.id,
							fields: {
								Status: status.literals[0],
							},
						},
					]),
				),
		});

		const insertReview = Effect.tryPromise(() =>
			reviewsTable.create([
				{
					fields: {
						email: review.email,
						created_at: review.created_at,
						decision: review.decision,
						reviewer_id: review.reviewer_id,
					},
				},
			]),
		);

		return yield* Effect.all([insertDecision, insertReview], {
			concurrency: 2,
		});
	}).pipe(
		Effect.tapErrorCause((error) => Console.error(error)),
		Effect.withSpan("app/(auth)/grade/actions/submitApplicationDecision"),
		Effect.runPromise,
	);
}
