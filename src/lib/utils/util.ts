import { Effect } from "effect";

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
