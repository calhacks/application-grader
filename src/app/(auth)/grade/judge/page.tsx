import { Effect, Option } from "effect";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { JudgeApplicationCard } from "@/app/(auth)/grade/_components/card";
import {
	JudgeStatisticsCard,
	StatisticsCardSkeleton,
} from "@/app/(auth)/grade/_components/statistics-card";
import { LogisticsTeamEmails } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import {
	findJudgeApplication,
	judgeProgressStatistics,
} from "@/lib/utils/airtable";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Grade() {
	const supabase = await createClient();
	const user = await SupabaseUser(supabase).pipe(Effect.runPromise);
	const application = findJudgeApplication.pipe(
		Effect.map(Option.getOrElse(() => null)),
		Effect.runPromise,
	);
	const statistics = judgeProgressStatistics.pipe(Effect.runPromise);

	console.log(await statistics);

	if (!user.email || !LogisticsTeamEmails.includes(user.email)) {
		redirect("/grade");
	}

	return (
		<main className="w-full h-full">
			<div className="relative p-8 flex flex-col items-center">
				<div className="hidden sm:block absolute top-4 right-4">
					<Suspense fallback={<StatisticsCardSkeleton />}>
						<JudgeStatisticsCard statistics={statistics} />
					</Suspense>
				</div>
				<Suspense
					fallback={
						<div className="font-mono">
							application is loading please wait
						</div>
					}
				>
					<JudgeApplicationCard
						application={application}
						reviewer={user}
					/>
				</Suspense>
			</div>
		</main>
	);
}
