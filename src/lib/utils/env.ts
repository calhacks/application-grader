import { config } from "@dotenvx/dotenvx";
import { Config, Effect, Schema } from "effect";

export const ServerEnv = Effect.gen(function* () {
	const production = process.env.VERCEL_ENV === "production";
	if (!production) {
		config({ path: ".env.local" });
	}

	return yield* Config.all({
		AirtablePat: Config.redacted(
			Schema.Config("AIRTABLE_PAT", Schema.NonEmptyString),
		),
		AirtableBaseId: Config.redacted(
			Schema.Config("AIRTABLE_BASE_ID", Schema.NonEmptyString),
		),
	});
}).pipe(Effect.withSpan("lib/utils/env.ts/ServerEnv"));
