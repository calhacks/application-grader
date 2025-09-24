import { Console, Data, Effect } from "effect";
import { createClient } from "@/lib/supabase/server";

export const SupabaseUser = Effect.gen(function* () {
	const supabase = yield* Effect.tryPromise(() => createClient());
	const userResponse = yield* Effect.tryPromise(() =>
		supabase.auth.getUser(),
	);
	return yield* Effect.fromNullable(userResponse.data.user).pipe(
		Effect.orElseFail(() => new SupabaseUserNotFound()),
	);
}).pipe(
	Effect.tapErrorCause((error) => Console.error(error)),
	Effect.withSpan("lib/utils/supabase/SupabaseUser"),
);

class SupabaseUserNotFound extends Data.TaggedError("SupabaseUserNotFound") {}
