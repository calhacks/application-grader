import { createServerClient } from "@supabase/ssr";
import { Effect, Redacted } from "effect";
import { cookies } from "next/headers";
import { ServerEnv } from "@/lib/utils/env";

export async function createClient() {
	const cookieStore = await cookies();
	const env = ServerEnv.pipe(Effect.runSync);

	return createServerClient(
		Redacted.value(env.SupabaseUrl),
		Redacted.value(env.SupabaseKey),
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}

export const SupabaseUser = Effect.gen(function* () {
	const supabase = yield* Effect.tryPromise(() => createClient());
	const userResponse = yield* Effect.tryPromise(() =>
		supabase.auth.getUser(),
	);
	return yield* Effect.fromNullable(userResponse.data.user);
});
