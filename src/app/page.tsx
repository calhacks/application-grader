import { AirtableDb } from "@/lib/utils/airtable";

export default async function Home() {
	const db = AirtableDb;
	const applications = db.table("Applications");
	// const emails = await applications.select({ fields: ["Email"] }).firstPage();
	// console.log(emails);

	return <>Hello world!</>;
}
