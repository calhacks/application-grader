import Airtable, { type FieldSet, type Table } from "airtable";
import {
	Console,
	Data,
	Effect,
	Array as EffectArray,
	Option,
	Redacted,
	Schema,
} from "effect";
import { ServerEnv } from "@/lib/env/server";
import { SupabaseUser } from "@/lib/utils/supabase";
import { Application } from "@/schema/airtable";

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

export const uniqueHackerApplication = Effect.gen(function* () {
	const user = yield* SupabaseUser;
	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");
	const reviewsTable = db.table("Reviews");

	const reviewedEmails = yield* Effect.tryPromise(() =>
		reviewsTable
			.select({
				fields: ["email"],
				filterByFormula: `reviewer_id = ${user.id}`,
			})
			.all(),
	).pipe(
		Effect.flatMap((records) =>
			Effect.allSuccesses(
				records.map((record) =>
					Schema.decodeUnknown(Schema.String)(record.fields.email),
				),
			),
		),
		Effect.map((emails) => new Set(emails)),
	);

	let retryTimes = 0;
	return yield* Effect.retry(
		Effect.gen(function* () {
			return yield* findFirstUniqueHackerApplication(
				applicationsTable,
				reviewedEmails,
				retryTimes,
			);
		}),
		{
			until: (error) => {
				if (error instanceof FailedRequest) {
					return true;
				}
				if (error instanceof NoApplicationFound) {
					return true;
				}
				retryTimes += 1;
				return false;
			},
		},
	);
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withSpan("lib/utils/airtable"),
);

export const findFirstUniqueHackerApplication = Effect.fn(
	"lib/utils/airtable/findFirstUniqueHackerApplication",
)(function* (
	applicationsTable: Table<FieldSet>,
	reviewedEmails: Set<string>,
	retryTimes: number,
) {
	const applicationRecords = yield* Effect.tryPromise({
		try: () =>
			applicationsTable
				.select({
					pageSize: 500,
					offset: retryTimes * 500,
				})
				.firstPage(),
		catch: () => new FailedRequest(),
	});

	const applications = yield* Effect.allSuccesses(
		applicationRecords.map((record) =>
			Schema.decodeUnknown(Application)(record.fields),
		),
	);
	if (applications.length === 0) {
		return yield* Effect.fail(new NoApplicationFound());
	}

	const result = EffectArray.findFirst(
		applications,
		(application) =>
			!!application.email && !reviewedEmails.has(application.email),
	);

	return yield* Option.match(result, {
		onNone: () =>
			Effect.fail({
				records: applicationRecords,
			}),
		onSome: (application) => Effect.succeed(application),
	});
});

class FailedRequest extends Data.TaggedError("FailedRequest") {}

class NoApplicationFound extends Data.TaggedError("NoApplicationFound") {}
