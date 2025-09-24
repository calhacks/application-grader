import { Effect, Exit } from "effect";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const userResponse = await SupabaseUser(supabase).pipe(
		Effect.runPromiseExit,
	);
	return Exit.match(userResponse, {
		onFailure: () => redirect("/"),
		onSuccess: () => children,
	});
}
