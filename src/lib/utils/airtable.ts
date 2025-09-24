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
import { Application, type ApplicationType, Review } from "@/schema/airtable";

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

export const findNewHackerApplication = Effect.gen(function* () {
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
				filterByFormula: `{Role} = "Hacker"`,
				pageSize: 100,
			})
			.eachPage(
				(records, paginate) => {
					Effect.allSuccesses(
						records.map((record) =>
							Schema.decodeUnknown(Application)(record.fields),
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
					Schema.decodeUnknown(Application)(record.fields),
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
