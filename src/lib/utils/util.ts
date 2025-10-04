import { Effect, Option, Schema } from "effect";
import { Status } from "@/schema/airtable";

export function camelCaseToTitleCase(input: string): string {
	return input
		.split(/(?=[A-Z])/)
		.join(" ")
		.replace(/^[a-z]/, (match) => match.toUpperCase());
}

export const dateStringToDate = Effect.fn("lib/utils/parse/dateStringToDate")(
	function* (input: string) {
		const match = yield* Effect.fromNullable(
			/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(input),
		);
		const [, year, month, day] = match.map(Number);
		return new Date(year, month - 1, day);
	},
);

export function isAdult(birthdate: Date, date: Date): boolean {
	const eighteenthBirthday = new Date(
		birthdate.getFullYear() + 18,
		birthdate.getMonth(),
		birthdate.getDate(),
	);
	return date >= eighteenthBirthday;
}

export function calculateHackerStatus({
	accept,
	reject,
}: {
	accept: number;
	reject: number;
}): Option.Option<(typeof Status.members)[number]> {
	if (accept >= 1) {
		return Status.pipe(Schema.pickLiteral("Accept"), Option.some);
	}
	if (reject >= 2) {
		return Status.pipe(Schema.pickLiteral("Rejected"), Option.some);
	}
	return Option.none();
}

export function calculateJudgeStatus({
	accept,
	reject,
}: {
	accept: number;
	reject: number;
}): Option.Option<(typeof Status.members)[number]> {
	if (accept >= 2) {
		return Status.pipe(Schema.pickLiteral("Accept"), Option.some);
	}
	if (reject >= 1) {
		return Status.pipe(Schema.pickLiteral("Rejected"), Option.some);
	}
	return Option.none();
}
