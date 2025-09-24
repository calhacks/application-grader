import { Effect, Option } from "effect";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Home() {
	const supabase = await createClient();
	const user = await SupabaseUser(supabase).pipe(
		Effect.option,
		Effect.runPromise,
	);
	if (Option.isSome(user)) {
		redirect("/grade");
	}

	return (
		<main className="w-full p-12 flex justify-center">
			<h1 className="font-mono">Please sign in :)</h1>
		</main>
	);
}
