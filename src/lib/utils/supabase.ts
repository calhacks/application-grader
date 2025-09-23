import { Effect, Option } from "effect";
import { createClient } from "@/lib/supabase/server";

export const SupabaseUser = Effect.gen(function* () {
	const supabase = yield* Effect.tryPromise(() => createClient());
	const userResponse = yield* Effect.tryPromise(() =>
		supabase.auth.getUser(),
	);
	return yield* Option.fromNullable(userResponse.data.user);
});
