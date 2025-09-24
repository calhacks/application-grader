import { Effect } from "effect";
import { Suspense } from "react";
import { ApplicationCard } from "@/app/(auth)/grade/_components/card";
import { createClient } from "@/lib/supabase/server";
import { findNewHackerApplication } from "@/lib/utils/airtable";
import { SupabaseUser } from "@/lib/utils/supabase";

export default async function Grade() {
	const supabase = await createClient();
	const user = SupabaseUser(supabase).pipe(Effect.runPromise);
	const application = findNewHackerApplication.pipe(
		Effect.flatten,
		Effect.runPromise,
	);

	return (
		<main className="w-full h-full">
			<div className="p-8 flex justify-center">
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
