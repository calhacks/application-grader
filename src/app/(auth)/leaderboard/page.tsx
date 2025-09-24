import type { User } from "@supabase/supabase-js";
import { Effect } from "effect";
import { Suspense } from "react";
import {
	columns,
	type LeaderboardView,
} from "@/app/(auth)/leaderboard/_components/columns";
import { DataTable } from "@/app/(auth)/leaderboard/_components/data-table";
import { createClient } from "@/lib/supabase/admin";
import { fetchHackerReviews } from "@/lib/utils/airtable";

export default async function Leaderboard() {
	const supabase = await createClient();

	const fetchSupabaseUsers = Effect.tryPromise(() =>
		supabase.auth.admin.listUsers({
			perPage: 10_000,
		}),
	).pipe(Effect.map((response) => response.data.users));

	const leaderboard = Effect.all([fetchHackerReviews, fetchSupabaseUsers], {
		concurrency: "unbounded",
	}).pipe(
		Effect.map(([reviews, users]) => {
			const reviewCounts = reviews.reduce<Record<string, number>>(
				(count, review) => {
					const reviewer = review.reviewerId;
					count[reviewer] = (count[reviewer] ?? 0) + 1;
					return count;
				},
				{},
			);

			return (users as User[]).reduce(
				(leaderboard: LeaderboardView[], user) => {
					const entry = reviewCounts[user.id];
					if (entry) {
						leaderboard.push({
							email: user.email ?? "",
							full_name: user.user_metadata?.full_name ?? "",
							applications_reviewed: entry,
						});
					}
					return leaderboard;
				},
				[],
			);
		}),
		Effect.runPromise,
	);

	return (
		<main className="flex justify-center p-8">
			<div className="max-w-content">
				<Suspense
					fallback={
						<div className="font-mono">leaderboard is loading</div>
					}
				>
					<DataTable columns={columns} data={leaderboard} />
				</Suspense>
			</div>
		</main>
	);
}
