import { Schema } from "effect";

export const StatusDeferred = Schema.Literal("Deferred");
export const StatusAccept = Schema.Literal("Accept");
export const StatusRejected = Schema.Literal("Rejected");
export const StatusConfirmed = Schema.Literal("Confirmed");

export const Status = Schema.Union(
	StatusDeferred,
	StatusAccept,
	StatusRejected,
	StatusConfirmed,
);
export type Status = typeof Status;

export const Application = Schema.Struct({
	id: Schema.String,
	email: Schema.optional(Schema.String).pipe(Schema.fromKey("Email")),
	firstName: Schema.optional(Schema.String).pipe(
		Schema.fromKey("First Name"),
	),
	lastName: Schema.optional(Schema.String).pipe(Schema.fromKey("Last Name")),
	phone: Schema.optional(Schema.String).pipe(Schema.fromKey("Phone")),
	role: Schema.optional(Schema.String).pipe(Schema.fromKey("Role")),
	birthday: Schema.optional(Schema.String).pipe(Schema.fromKey("Birthday")),
	university: Schema.optional(Schema.String).pipe(
		Schema.fromKey("University"),
	),
	majorStudying: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Major / studying"),
	),
	levelOfStudy: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Level of study"),
	),
	graduationClass: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Graduation class"),
	),
	country: Schema.optional(Schema.String).pipe(Schema.fromKey("Country")),
	underrepresented: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Underrepresented?"),
	),
	gender: Schema.optional(Schema.String).pipe(Schema.fromKey("Gender")),
	raceEthnicity: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Race / ethnicity"),
	),
	previousHackathons: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Previous hackathons"),
	),
	lgbtq: Schema.optional(Schema.String).pipe(Schema.fromKey("LGBTQ?")),
	beenToCalHacks: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Been to Cal Hacks before?"),
	),
	previousBerkeleyHackathons: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Previous Hackathons @ Berkeley events"),
	),
	referrer: Schema.optional(Schema.String).pipe(Schema.fromKey("Referrer")),
	favouriteProject: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Favourite project"),
	),
	plannedProject: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Planned project"),
	),
	takeaways: Schema.optional(Schema.String).pipe(Schema.fromKey("Takeaways")),
	goal: Schema.optional(Schema.String).pipe(Schema.fromKey("Goal")),
	joke: Schema.optional(Schema.String).pipe(Schema.fromKey("Joke")),
	github: Schema.optional(Schema.String).pipe(Schema.fromKey("GitHub")),
	devpost: Schema.optional(Schema.String).pipe(Schema.fromKey("Devpost")),
	linkedin: Schema.optional(Schema.String).pipe(Schema.fromKey("LinkedIn")),
	resume: Schema.optional(
		Schema.Array(
			Schema.Struct({
				id: Schema.optional(Schema.String),
				url: Schema.optional(Schema.String),
				filename: Schema.optional(Schema.String),
				size: Schema.optional(Schema.Number),
				type: Schema.optional(Schema.String),
				width: Schema.optional(Schema.Number),
				height: Schema.optional(Schema.Number),
				thumbnails: Schema.optional(
					Schema.Struct({
						small: Schema.optional(
							Schema.Struct({
								url: Schema.optional(Schema.String),
								width: Schema.optional(Schema.Number),
								height: Schema.optional(Schema.Number),
							}),
						),
						large: Schema.optional(
							Schema.Struct({
								url: Schema.optional(Schema.String),
								width: Schema.optional(Schema.Number),
								height: Schema.optional(Schema.Number),
							}),
						),
					}),
				),
			}),
		),
	).pipe(Schema.fromKey("Resume")),
	employer: Schema.optional(Schema.String).pipe(Schema.fromKey("Employer")),
	jobTitle: Schema.optional(Schema.String).pipe(Schema.fromKey("Job title")),
	areasOfExpertise: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Areas of expertise"),
	),
	lookingForwardJudge: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Looking forward (judge)"),
	),
	pastProjectJudge: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Past project (judge)"),
	),
	volunteerIntroduction: Schema.optional(Schema.String).pipe(
		Schema.fromKey("Volunteer introduction"),
	),
	status: Schema.optional(Status).pipe(Schema.fromKey("Status")),
});

export type ApplicationType = typeof Application.Type;
export type ApplicationEncoded = typeof Application.Encoded;

export const Decision = Schema.Literal("accept", "reject");
export type Decision = typeof Decision;

export const Review = Schema.Struct({
	id: Schema.Number,
	email: Schema.String,
	createdAt: Schema.propertySignature(Schema.String).pipe(
		Schema.fromKey("created_at"),
	),
	reviewerId: Schema.propertySignature(Schema.String).pipe(
		Schema.fromKey("reviewer_id"),
	),
	decision: Decision,
});

export type ReviewType = typeof Review.Type;
export type ReviewEncoded = typeof Review.Encoded;
