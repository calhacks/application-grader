import { Effect } from "effect";
import { redirect } from "next/navigation";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	console.log("AuthLayout");

	await SupabaseUser.pipe(
		Effect.tap((user) => console.log(user)),
		Effect.tapErrorCause((error) =>
			Effect.sync(() => console.error(error)),
		),
		Effect.tapError(() => Effect.sync(() => redirect("/"))),
		Effect.runPromiseExit,
	);

	return children;
}
