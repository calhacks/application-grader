import Airtable from "airtable";
import {
	Chunk,
	Console,
	Effect,
	Array as EffectArray,
	Match,
	Option,
	Random,
	Redacted,
	Schema,
} from "effect";
import { ServerEnv } from "@/lib/env/server";
import { createClient } from "@/lib/supabase/server";
import { SupabaseUser } from "@/lib/utils/supabase";
import {
	Application,
	type ApplicationColumns,
	ApplicationEmail,
	ApplicationReviewNeeded,
	ApplicationStatus,
	type ApplicationType,
	Decision,
	Review,
	StatusAccept,
	StatusDeferred,
	StatusRejected,
} from "@/schema/airtable";

Effect.gen(function* () {
	const { AirtablePat } = yield* ServerEnv;
	Airtable.configure({ apiKey: Redacted.value(AirtablePat) });
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withSpan("lib/utils/airtable"),
	Effect.runSync,
);

export const AirtableDb = Effect.gen(function* () {
	const { AirtableBaseId } = yield* ServerEnv;
	return Airtable.base(Redacted.value(AirtableBaseId));
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withSpan("lib/utils/airtable"),
);

export const findHackerApplication = Effect.gen(function* () {
	const supabase = yield* Effect.tryPromise(() => createClient());
	const user = yield* SupabaseUser(supabase);
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");

	return yield* Effect.async<Option.Option<ApplicationType>>((resume) => {
		applicationsTable
			.select({
				filterByFormula: `AND(
          {Role} = "Hacker",
          {Review needed} = 1,
          {Reviewer 1} != "${user.id}",
          {Reviewer 2} != "${user.id}",
          {Reviewer 3} != "${user.id}"
        )`,
				pageSize: 100,
			})
			.eachPage(
				(records, paginate) => {
					Effect.allSuccesses(
						records.map((record) =>
							Schema.decodeUnknown(Application)({
								id: record.id,
								...record.fields,
							}),
						),
					).pipe(
						Effect.flatMap(Random.shuffle),
						Effect.map(Chunk.head),
						Effect.tap(
							Option.match({
								onNone: () => paginate(),
								onSome: (application) =>
									resume(
										Effect.succeed(
											Option.some(application),
										),
									),
							}),
						),
						Effect.runPromise,
					);
				},
				() => resume(Effect.succeed(Option.none())),
			);
	});
}).pipe(
	Effect.tapErrorCause(Console.error),
	Effect.withLogSpan("lib/utils/airtable/findHackerApplication"),
);

export const findJudgeApplication = Effect.gen(function* () {
	const supabase = yield* Effect.tryPromise(() => createClient());
	const user = yield* SupabaseUser(supabase);
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");

	return yield* Effect.async<Option.Option<ApplicationType>>((resume) => {
		applicationsTable
			.select({
				filterByFormula: `AND(
           {Role} = "Judge",
           {Review needed} = 1,
           {Reviewer 1} != "${user.id}",
           {Reviewer 2} != "${user.id}",
           {Reviewer 3} != "${user.id}"
         )`,
				pageSize: 100,
			})
			.eachPage(
				(records, paginate) => {
					Effect.allSuccesses(
						records.map((record) =>
							Schema.decodeUnknown(Application)({
								id: record.id,
								...record.fields,
							}),
						),
					).pipe(
						Effect.flatMap(Random.shuffle),
						Effect.map(Chunk.head),
						Effect.tap(
							Option.match({
								onNone: () => paginate(),
								onSome: (application) =>
									resume(
										Effect.succeed(
											Option.some(application),
										),
									),
							}),
						),
						Effect.runPromise,
					);
				},
				() => resume(Effect.succeed(Option.none())),
			);
	});
});

export const fetchHackerApplications = Effect.fn(
	"lib/utils/airtable/fetchHackerApplications",
)(function* (fields?: ApplicationColumns[]) {
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");

	return yield* Effect.tryPromise(() =>
		applicationsTable
			.select({
				fields: fields,
				filterByFormula: `{Role} = "Hacker"`,
			})
			.all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(Application)({
						id: record.id,
						...record.fields,
					}),
				),
			),
		),
	);
});

export const fetchJudgeApplications = Effect.fn(
	"lib/utils/airtable/fetchJudgeApplications",
)(function* (fields?: ApplicationColumns[]) {
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");

	return yield* Effect.tryPromise(() =>
		applicationsTable
			.select({
				fields: fields,
				filterByFormula: `{Role} = "Judge"`,
			})
			.all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(Application)({
						id: record.id,
						...record.fields,
					}),
				),
			),
		),
	);
});

export const fetchHackerReviews = Effect.gen(function* () {
	const db = yield* AirtableDb;
	const reviewsTable = db.table("Reviews");

	return yield* Effect.tryPromise(() => reviewsTable.select().all()).pipe(
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
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withLogSpan("lib/utils/airtable/fetchHackerReviews"),
);

export const fetchJudgeReviews = Effect.gen(function* () {
	const db = yield* AirtableDb;
	const reviewsTable = db.table("Judge Reviews");

	return yield* Effect.tryPromise(() => reviewsTable.select().all()).pipe(
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
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withLogSpan("lib/utils/airtable/fetchHackerReviews"),
);

export const hackerProgressStatistics = Effect.gen(function* () {
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");
	const reviewsTable = db.table("Reviews");

	const fetchApplications = Effect.tryPromise(() =>
		applicationsTable
			.select({
				filterByFormula: `AND(
          {Role} = "Hacker"
        )`,
				fields: [
					ApplicationEmail.literals[0],
					ApplicationStatus.literals[0],
					ApplicationReviewNeeded.literals[0],
				],
			})
			.all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(
						Application.pick("email", "status", "reviewNeeded"),
					)(record.fields),
				),
			),
		),
		Effect.map((records) => new Set(records)),
	);

	const fetchReviews = Effect.tryPromise(() =>
		reviewsTable.select({ fields: ["email", "decision"] }).all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(Review.pick("email", "decision"))(
						record.fields,
					),
				),
			),
		),
	);

	const [applications, reviews] = yield* Effect.all(
		[fetchApplications, fetchReviews],
		{ concurrency: 2 },
	);

	const applicationsByStatus = EffectArray.groupBy(
		applications,
		(application) => application.status ?? "No Status",
	);

	const [_applicationsReviewed, applicationsNotReviewed] =
		EffectArray.partition(
			applications,
			(application) => application.reviewNeeded === 1,
		);

	const reviewsByEmail = EffectArray.groupBy(
		reviews,
		(review) => review.email,
	);

	// The reason why I calculate the number of accepted
	// applications instead of using `applicationByStatus`
	// is because the applications table has some leftover
	// accepted applications that did not confirm by the
	// deadline (hence inflating the total acceptance number).
	const applicationAccepts = EffectArray.countBy(
		Object.values(reviewsByEmail),
		(reviews) =>
			Option.isSome(
				EffectArray.findFirst(
					reviews,
					(review) => review.decision === "accept",
				),
			),
	);

	return {
		acceptedApplications: applicationAccepts || 0,
		rejectedApplications:
			applicationsByStatus[StatusRejected.literals[0]]?.length || 0,
		deferredApplications:
			applicationsByStatus[StatusDeferred.literals[0]]?.length || 0,
		applicationsBegan: Object.keys(reviewsByEmail).length,
		regularRoundApplications:
			Object.keys(reviewsByEmail).length + applicationsNotReviewed.length,
		totalApplications: applications.size,
	};
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withLogSpan("lib/utils/airtable/hackerProgressStatistics"),
);

export const judgeProgressStatistics = Effect.gen(function* () {
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");

	const applications = yield* Effect.tryPromise(() =>
		applicationsTable
			.select({
				filterByFormula: `AND(
          {Role} = "Judge"
        )`,
				fields: [
					ApplicationEmail.literals[0],
					ApplicationStatus.literals[0],
					ApplicationReviewNeeded.literals[0],
				],
			})
			.all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(
						Application.pick("email", "status", "reviewNeeded"),
					)(record.fields),
				),
			),
		),
		Effect.map((records) => new Set(records)),
	);

	const applicationsByStatus = EffectArray.groupBy(
		applications,
		(application) => application.status ?? "No Status",
	);

	return {
		acceptedApplications:
			applicationsByStatus[StatusAccept.literals[0]]?.length || 0,
		rejectedApplications:
			applicationsByStatus[StatusRejected.literals[0]]?.length || 0,
		applicationsBegan:
			applications.size - applicationsByStatus["No Status"]?.length || 0,
		totalApplications: applications.size,
	};
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withLogSpan("lib/utils/airtable/judgeProgressStatistics"),
);
