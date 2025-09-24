import { Effect, Option } from "effect";
import { redirect } from "next/navigation";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Home() {
	const user = await SupabaseUser.pipe(Effect.option, Effect.runPromise);
	if (Option.isSome(user)) {
		redirect("/grade");
	}

	return (
		<main className="w-full p-12 flex justify-center">
			<h1 className="font-mono">Please sign in :)</h1>
		</main>
	);
}
