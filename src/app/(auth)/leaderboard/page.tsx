import { createClient } from "@/lib/supabase/admin";

export default async function Leaderboard() {
	const supabase = await createClient();
	const { data: usersResponse } = await supabase.auth.admin.listUsers({
		perPage: 10_000,
	});

	return (
		<main className="flex justify-center">
			<div className="max-w-content"></div>
		</main>
	);
}
