import Airtable from "airtable";
import {
	Console,
	Effect,
	Array as EffectArray,
	Option,
	Redacted,
	Schema,
} from "effect";
import { ServerEnv } from "@/lib/env/server";
import { SupabaseUser } from "@/lib/utils/supabase";
import { Application, type ApplicationType } from "@/schema/airtable";

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
	const user = yield* SupabaseUser;

	const db = yield* AirtableDb;
	const applicationsTable = db.table("Applications");
	const reviewsTable = db.table("Reviews");

	const reviewedEmails = yield* Effect.tryPromise(() =>
		reviewsTable
			.select({
				fields: ["email"],
				filterByFormula: `{reviewer_id} = '${user.id}'`,
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

	return yield* Effect.async<Option.Option<ApplicationType>>((resume) => {
		applicationsTable.select({ pageSize: 100 }).eachPage(
			(records, paginate) => {
				Effect.allSuccesses(
					records.map((record) =>
						Schema.decodeUnknown(Application)(record.fields),
					),
				).pipe(
					Effect.map(
						EffectArray.findFirst((application) =>
							application.email
								? !reviewedEmails.has(application.email)
								: false,
						),
					),
					Effect.tap(
						Option.match({
							onNone: () => paginate(),
							onSome: (application) =>
								resume(
									Effect.succeed(Option.some(application)),
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
