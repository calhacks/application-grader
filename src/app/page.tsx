import { Effect, Schema } from "effect";
import { AirtableDb } from "@/lib/utils/airtable";
import { Application } from "@/schema/airtable";

export default async function Home() {
	const db = AirtableDb.pipe(Effect.runSync);
	const applications = db.table("Applications");
	const applicationsList = await applications.select().firstPage();
	const decoded = applicationsList
		.slice(0, 5)
		.map((application) =>
			Schema.decodeSync(Application)(application.fields),
		);

	return <>{JSON.stringify(decoded, null, 2)}</>;
}
