import { Config, Effect, Schema } from "effect";

export const ClientEnv = Effect.gen(function* () {
	return yield* Config.all({
		Host: Config.redacted(
			Schema.Config("NEXT_PUBLIC_VERCEL_URL", Schema.NonEmptyString).pipe(
				Config.withDefault("http://localhost:3000"),
			),
		),
		SupabaseUrl: Config.redacted(
			Schema.Config(
				"NEXT_PUBLIC_SUPABASE_URL",
				Schema.NonEmptyString,
			).pipe(
				Config.withDefault(
					Schema.decodeUnknownSync(Schema.String)(
						process.env.NEXT_PUBLIC_SUPABASE_URL,
					),
				),
			),
		),
		SupabaseKey: Config.redacted(
			Schema.Config(
				"NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
				Schema.NonEmptyString,
			).pipe(
				Config.withDefault(
					Schema.decodeUnknownSync(Schema.String)(
						process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
					),
				),
			),
		),
	});
}).pipe(Effect.withSpan("lib/utils/env.ts/ClientEnv"));
