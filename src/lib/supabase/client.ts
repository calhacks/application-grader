import { createBrowserClient } from "@supabase/ssr";
import { Effect, Redacted } from "effect";
import { ClientEnv } from "@/lib/env/client";

export function createClient() {
	const env = ClientEnv.pipe(Effect.runSync);

	return createBrowserClient(
		Redacted.value(env.SupabaseUrl),
		Redacted.value(env.SupabaseKey),
	);
}
