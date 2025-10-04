import type { User } from "@supabase/supabase-js";
import { Effect } from "effect";
import { Suspense } from "react";
import {
	columns,
	type LeaderboardView,
} from "@/app/(auth)/leaderboard/_components/columns";
import { DataTable } from "@/app/(auth)/leaderboard/_components/data-table";
import { createClient } from "@/lib/supabase/admin";
import { fetchHackerReviews, fetchJudgeReviews } from "@/lib/utils/airtable";

export default async function Leaderboard() {
	const supabase = await createClient();

	const fetchSupabaseUsers = Effect.tryPromise(() =>
		supabase.auth.admin.listUsers({
			perPage: 10_000,
		}),
	).pipe(Effect.map((response) => response.data.users));

	const leaderboard = Effect.all(
		[fetchHackerReviews, fetchJudgeReviews, fetchSupabaseUsers],
		{
			concurrency: "unbounded",
		},
	).pipe(
		Effect.map(([hackerReviews, judgeReviews, users]) => {
			const reviewCounts = hackerReviews.reduce<
				Record<string, { hacker: number; judge: number }>
			>((counts, review) => {
				const reviewer = review.reviewerId;
				if (counts[reviewer]) {
					counts[reviewer].hacker += 1;
				} else {
					counts[reviewer] = { hacker: 1, judge: 0 };
				}
				return counts;
			}, {});

			judgeReviews.forEach((review) => {
				const reviewer = review.reviewerId;
				if (reviewCounts[reviewer]) {
					reviewCounts[reviewer].judge += 1;
				} else {
					reviewCounts[reviewer] = { hacker: 0, judge: 1 };
				}
			});

			return (users as User[]).reduce(
				(leaderboard: LeaderboardView[], user) => {
					const hackerEntry = reviewCounts[user.id];
					const judgeEntry = reviewCounts[user.id];
					if (hackerEntry || judgeEntry) {
						leaderboard.push({
							email: user.email ?? "",
							full_name: user.user_metadata?.full_name ?? "",
							hacker_applications_reviewed:
								hackerEntry.hacker ?? 0,
							judge_applications_reviewed: judgeEntry.judge ?? 0,
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
		<main className="flex sm:justify-center p-8">
			<div className="max-w-full sm:max-w-content">
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
