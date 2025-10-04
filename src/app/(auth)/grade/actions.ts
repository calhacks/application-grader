"use server";

import { Console, Effect, Array as EffectArray, Option, Schema } from "effect";
import { AirtableDb } from "@/lib/utils/airtable";
import { calculateStatus } from "@/lib/utils/util";
import {
	Application,
	type ApplicationEncoded,
	ApplicationReviewer1,
	ApplicationReviewer2,
	ApplicationReviewer3,
	Review,
	type ReviewEncoded,
} from "@/schema/airtable";

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

		const fetchApplication = Effect.tryPromise(() =>
			applicationsTable
				.select({
					filterByFormula: `{Email} = '${review.email}'`,
					maxRecords: 1,
				})
				.firstPage(),
		).pipe(
			Effect.flatMap(EffectArray.head),
			Effect.flatMap((record) =>
				Schema.decodeUnknown(Application)({
					id: record.id,
					...record.fields,
				}),
			),
		);

		const fetchReviews = Effect.tryPromise(() =>
			reviewsTable
				.select({
					filterByFormula: `{Email} = '${review.email}'`,
				})
				.all(),
		).pipe(
			Effect.flatMap((records) =>
				Effect.allSuccesses(
					records.map((record) =>
						Schema.decodeUnknown(Review)({
							id: record.id,
							...record.fields,
						}),
					),
				),
			),
		);

		const [application, reviews] = yield* Effect.all(
			[fetchApplication, fetchReviews],
			{ concurrency: 2 },
		);

		const decisions = {
			accept: 0,
			reject: 0,
		};

		for (const { decision } of reviews) {
			if (decision === "accept") {
				decisions.accept += 1;
			} else if (decision === "reject") {
				decisions.reject += 1;
			}
		}

		if (
			!application.reviewNeeded ||
			decisions.accept >= 1 ||
			decisions.reject >= 2
		) {
			return;
		}

		const adjustedDecisions = {
			accept: decisions.accept + (review.decision === "accept" ? 1 : 0),
			reject: decisions.reject + (review.decision === "reject" ? 1 : 0),
		};

		const status = calculateStatus(adjustedDecisions);
		const insertDecision = Option.match(status, {
			onNone: () => Effect.void,
			onSome: (status) => {
				return Effect.tryPromise(() =>
					applicationsTable.update([
						{
							id: applicationId.id,
							fields: {
								Status: status.literals[0],
							},
						},
					]),
				);
			},
		});

		const insertReviewer = Effect.tryPromise(() => {
			const reviewerSlot =
				application.reviewer1 === undefined
					? ApplicationReviewer1.literals[0]
					: application.reviewer2 === undefined
						? ApplicationReviewer2.literals[0]
						: ApplicationReviewer3.literals[0];
			return applicationsTable.update([
				{
					id: applicationId.id,
					fields: {
						[reviewerSlot]: review.reviewer_id,
					},
				},
			]);
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

		return yield* Effect.all(
			[insertDecision, insertReviewer, insertReview],
			{
				concurrency: "unbounded",
			},
		);
	}).pipe(
		Effect.tapErrorCause((error) => Console.error(error)),
		Effect.withSpan("app/(auth)/grade/actions/submitApplicationDecision"),
		Effect.runPromise,
	);
}
