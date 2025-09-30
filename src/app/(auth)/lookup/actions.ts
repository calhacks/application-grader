"use server";

import { Console, Effect } from "effect";
import { AirtableDb } from "@/lib/utils/airtable";
import type { Status } from "@/schema/airtable";

export async function updateHackerApplicationStatus(
	applicationId: string,
	status: Status,
) {
	return await Effect.gen(function* () {
		const db = yield* AirtableDb;
		const applicationsTable = db.table("Applications");

		yield* Effect.tryPromise(() =>
			applicationsTable.update([
				{
					id: applicationId,
					fields: { Status: status },
				},
			]),
		);
	}).pipe(
		Effect.tapErrorCause((error) => Console.error(error)),
		Effect.withSpan(
			"app/(auth)/lookup/actions/updateHackerApplicationStatus",
		),
		Effect.runPromise,
	);
}
