"use server";

import { Console, Effect } from "effect";
import { AirtableDb } from "@/lib/utils/airtable";
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
