import type { SupabaseClient } from "@supabase/supabase-js";
import { Data, Effect } from "effect";

export const SupabaseUser = Effect.fn("lib/utils/supabase/SupabaseUser")(
	function* (supabaseClient: SupabaseClient) {
		const userResponse = yield* Effect.tryPromise(() =>
			supabaseClient.auth.getUser(),
		);
		return yield* Effect.fromNullable(userResponse.data.user).pipe(
			Effect.orElseFail(() => new SupabaseUserNotFound()),
		);
	},
);

class SupabaseUserNotFound extends Data.TaggedError("SupabaseUserNotFound") {}
