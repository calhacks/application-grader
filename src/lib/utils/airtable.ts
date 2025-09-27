import Airtable from "airtable";
import {
	Chunk,
	Console,
	Effect,
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
	type ApplicationType,
	Decision,
	Review,
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

export const findNewHackerApplication = Effect.fn(
	"lib/utils/airtable/findNewHackerApplication",
)(function* ({ priority }: { priority: boolean }) {
	const supabase = yield* Effect.tryPromise(() => createClient());
	const user = yield* SupabaseUser(supabase);
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");
	const reviewsTable = db.table("Reviews");

	const reviews = yield* Effect.tryPromise(() =>
		reviewsTable.select().all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(Review)(record.fields),
				),
			),
		),
	);

	const previouslyReviewedEmails = new Set(
		reviews
			.filter((review) => review.reviewerId === user.id)
			.map((review) => review.email),
	);

	const reviewDecisionCounts = reviews.reduce((count, review) => {
		const reviewCount = count.get(review.email);
		if (!reviewCount) {
			count.set(review.email, {
				accepts: review.decision === "accept" ? 1 : 0,
				rejects: review.decision === "reject" ? 1 : 0,
			});
			return count;
		}
		if (review.decision === "accept") {
			reviewCount.accepts += 1;
		}
		if (review.decision === "reject") {
			reviewCount.rejects += 1;
		}
		return count;
	}, new Map<string, { accepts: number; rejects: number }>());

	const completedEmails = new Set(
		Array.from(reviewDecisionCounts.entries())
			.filter(([_, { accepts, rejects }]) => accepts >= 2 || rejects >= 1)
			.map(([email]) => email),
	);

	const excludedEmails = previouslyReviewedEmails.union(completedEmails);

	return yield* Effect.async<Option.Option<ApplicationType>>((resume) => {
		applicationsTable
			.select({
				filterByFormula: priority
					? `AND({Role} = "Hacker", {Created at} < DATETIME_PARSE("2025-09-24", "YYYY-MM-DD"))`
					: `{Role} = "Hacker"`,
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
						Effect.map(
							Chunk.findFirst((application) =>
								application.email
									? !excludedEmails.has(application.email)
									: false,
							),
						),
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
)(function* (fields?: string[]) {
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

export const fetchHackerReviews = Effect.gen(function* () {
	const db = yield* AirtableDb;
	const reviewsTable = db.table("Reviews");

	return yield* Effect.tryPromise(() => reviewsTable.select().all()).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(Review)(record.fields),
				),
			),
		),
	);
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withSpan("lib/utils/airtable/fetchHackerReviews"),
);

export const progressStatistics = Effect.fnUntraced(function* ({
	priority,
}: {
	priority: boolean;
}) {
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");
	const reviewsTable = db.table("Reviews");

	const fetchApplications = Effect.tryPromise(() =>
		applicationsTable
			.select({
				filterByFormula: priority
					? `AND({Role} = "Hacker", {Created at} < DATETIME_PARSE("2025-09-24", "YYYY-MM-DD"))`
					: `{Role} = "Hacker"`,
				fields: ["Email"],
			})
			.all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(
						Schema.Struct({
							Email: Schema.String,
						}),
					)(record.fields),
				),
			),
		),
		Effect.map((records) => new Set(records.map((record) => record.Email))),
	);

	const fetchReviews = Effect.tryPromise(() =>
		reviewsTable.select({ fields: ["email", "decision"] }).all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(
						Schema.Struct({
							email: Schema.String,
							decision: Decision,
						}),
					)(record.fields),
				),
			),
		),
	);

	const [applications, reviews] = yield* Effect.all(
		[fetchApplications, fetchReviews],
		{ concurrency: 2 },
	);

	const acceptedApplications = new Set<string>();
	const rejectedApplications = new Set<string>();
	const deferredApplications = new Set<string>();
	let applicationsBegan = 0;

	const reviewsCache = new Map<
		string,
		{ accepted: number; rejected: number }
	>();
	for (const review of reviews) {
		if (!applications.has(review.email)) {
			continue;
		}

		const entry = reviewsCache.get(review.email);
		if (!entry) {
			reviewsCache.set(review.email, {
				accepted: review.decision === "accept" ? 1 : 0,
				rejected: review.decision === "reject" ? 1 : 0,
			});
			applicationsBegan += 1;
		} else {
			if (review.decision === "accept") {
				entry.accepted += 1;
			} else if (review.decision === "reject") {
				entry.rejected += 1;
			}
		}
	}

	for (const [email, entry] of reviewsCache) {
		if (entry.accepted >= 2) {
			acceptedApplications.add(email);
		} else if (entry.accepted >= 1 && entry.rejected >= 1) {
			deferredApplications.add(email);
		} else if (entry.rejected >= 1) {
			rejectedApplications.add(email);
		}
	}

	return {
		acceptedApplications: acceptedApplications.size,
		rejectedApplications: rejectedApplications.size,
		deferredApplications: deferredApplications.size,
		applicationsBegan,
		totalApplications: applications.size,
	};
});
