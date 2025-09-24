"use server";

import { Console, Effect } from "effect";
import { AirtableDb, fetchHackerReviews } from "@/lib/utils/airtable";
import type { ReviewEncoded } from "@/schema/airtable";

export async function submitApplicationDecision(
	review: Pick<
		ReviewEncoded,
		"created_at" | "decision" | "email" | "reviewer_id"
	>,
) {
	Effect.gen(function* () {
		const db = yield* AirtableDb;
		const reviewsTable = db.table("Reviews");

		const reviews = yield* fetchHackerReviews;
		const decisions = { accept: 0, reject: 0 };
		for (const { decision, email } of reviews) {
			if (review.email === email) {
				if (decision === "accept") {
					decisions.accept += 1;
				} else if (decision === "reject") {
					decisions.reject += 1;
				}
			}

			if (decisions.accept >= 2 || decisions.reject >= 1) {
				return;
			}
		}

		yield* Effect.tryPromise(() =>
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
	}).pipe(
		Effect.tapErrorCause((error) => Console.error(error)),
		Effect.withSpan("app/(auth)/grade/actions/submitApplicationDecision"),
		Effect.runPromise,
	);
}
