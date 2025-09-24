import { Effect, Option } from "effect";
import Link from "next/link";
import { AuthButton } from "@/components/header/auth-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Header() {
	const supabase = await createClient();
	const user = await SupabaseUser(supabase).pipe(
		Effect.option,
		Effect.runPromise,
	);

	return (
		<header className="w-screen flex justify-center items-center px-12 border-b-2">
			<div className="max-w-content w-full py-4">
				<Link href="/" className="font-bold text-lg text-black">
					Cal Hacks 12.0 Grader
				</Link>
			</div>

			<nav className="grid grid-flow-col auto-cols-max justify-center gap-x-4">
				<Button asChild variant="ghost">
					<Link
						href="/grade"
						className="font-medium text-base text-neutral-900"
					>
						Grade
					</Link>
				</Button>

				<Button asChild variant="ghost">
					<Link
						href="/leaderboard"
						className="font-medium text-base text-neutral-900"
					>
						Leaderboard
					</Link>
				</Button>

				<Button asChild variant="ghost">
					<Link
						href="/lookup"
						className="font-medium text-base text-neutral-900"
					>
						Lookup
					</Link>
				</Button>

				<AuthButton signedIn={Option.isSome(user)} />
			</nav>
		</header>
	);
}
