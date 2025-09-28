import { Effect, Option } from "effect";
import fs from "fs";
import { Suspense } from "react";
import { ApplicationCard } from "@/app/(auth)/grade/_components/card";
import {
	StatisticsCard,
	StatisticsCardSkeleton,
} from "@/app/(auth)/grade/_components/statistics-card";
import { createClient } from "@/lib/supabase/server";
import {
	findNewHackerApplication,
	progressStatistics,
} from "@/lib/utils/airtable";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Grade() {
	const supabase = await createClient();
	const user = SupabaseUser(supabase).pipe(Effect.runPromise);
	const application = findNewHackerApplication({ priority: true }).pipe(
		Effect.map(Option.getOrElse(() => null)),
		Effect.runPromise,
	);
	const statistics = progressStatistics({ priority: true }).pipe(
		Effect.runPromise,
	);

	return (
		<main className="w-full h-full">
			<div className="relative p-8 flex flex-col items-center">
				<div className="hidden sm:block absolute top-4 right-4">
					<Suspense fallback={<StatisticsCardSkeleton />}>
						<StatisticsCard statistics={statistics} />
					</Suspense>
				</div>
				<Suspense
					fallback={
						<div className="font-mono">
							application is loading please wait
						</div>
					}
				>
					<ApplicationCard
						application={application}
						reviewer={user}
					/>
				</Suspense>
			</div>
		</main>
	);
}
