import { Effect } from "effect";
import { columns } from "@/app/(auth)/lookup/_components/columns";
import { DataTable } from "@/app/(auth)/lookup/_components/data-table";
import { fetchHackerApplications } from "@/lib/utils/airtable";

export default async function Lookup() {
	const hackerApplications = await fetchHackerApplications([
		"Birthday",
		"Country",
		"Email",
		"First Name",
		"Graduation class",
		"Last Name",
		"Level of study",
		"Major / studying",
		"Role",
		"University",
	]).pipe(Effect.runPromise);

	return (
		<main className="flex justify-center p-8">
			<div className="max-w-content">
				<DataTable columns={columns} data={hackerApplications} />
			</div>
		</main>
	);
}
