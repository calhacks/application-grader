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
		SupabaseUrl: Config.redacted(
			Schema.Config("NEXT_PUBLIC_SUPABASE_URL", Schema.NonEmptyString),
		),
		SupabaseKey: Config.redacted(
			Schema.Config(
				"NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
				Schema.NonEmptyString,
			),
		),
		SupabaseSecretKey: Config.redacted(
			Schema.Config("SUPABASE_SECRET_KEY", Schema.NonEmptyString),
		),
	});
}).pipe(Effect.withSpan("lib/utils/env.ts/ServerEnv"));
