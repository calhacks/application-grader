"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
	const supabase = createClient();

	return (
		<header className="w-screen flex justify-center items-center px-12 border-b-2">
			<div className="max-w-content w-full py-4">
				<Link href="/" className="font-bold text-lg text-black">
					Cal Hacks Grader
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

				<Button
					variant="default"
					onClick={async () => {
						await supabase.auth.signInWithOAuth({
							provider: "google",
							options: {
								redirectTo: `${window.location.origin}/auth/callback`,
							},
						});
					}}
					className="font-medium text-sm"
				>
					Sign in
				</Button>
			</nav>
		</header>
	);
}
