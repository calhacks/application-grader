import { Effect, Option } from "effect";
import Link from "next/link";
import { AuthButton } from "@/components/header/auth-button";
import { Button } from "@/components/ui/button";
import { LogisticsTeamEmails } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Header() {
	const supabase = await createClient();
	const user = await SupabaseUser(supabase).pipe(
		Effect.option,
		Effect.runPromise,
	);

	const isLogisticsTeam = user.pipe(
		Option.map((user) =>
			user.email ? LogisticsTeamEmails.includes(user.email) : false,
		),
		Option.getOrElse(() => false),
	);

	return (
		<header className="w-screen flex justify-between items-center py-4 px-2 sm:px-12 border-b-2">
			<Link
				href="/"
				className="font-bold text-sm sm:text-lg text-black hidden sm:block"
			>
				Grader
			</Link>

			<nav className="grid grid-flow-col auto-cols-max justify-center sm:gap-x-4">
				<Button asChild variant="ghost">
					<Link
						href="/grade"
						className="font-medium text-sm sm:text-base text-neutral-900"
					>
						Grade
					</Link>
				</Button>

				{isLogisticsTeam && (
					<Button asChild variant="ghost">
						<Link
							href="/grade/judge"
							className="font-medium text-sm sm:text-base text-neutral-900"
						>
							Judge Applications
						</Link>
					</Button>
				)}

				<Button asChild variant="ghost">
					<Link
						href="/leaderboard"
						className="font-medium text-sm sm:text-base text-neutral-900"
					>
						Leaderboard
					</Link>
				</Button>

				<Button asChild variant="ghost">
					<Link
						href="/lookup"
						className="font-medium text-sm sm:text-base text-neutral-900"
					>
						Lookup
					</Link>
				</Button>
			</nav>

			<AuthButton signedIn={Option.isSome(user)} />
		</header>
	);
}
