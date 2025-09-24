import { Effect, Exit } from "effect";
import { redirect } from "next/navigation";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const userResponse = await SupabaseUser.pipe(Effect.runPromiseExit);
	return Exit.match(userResponse, {
		onFailure: () => redirect("/"),
		onSuccess: () => children,
	});
}
