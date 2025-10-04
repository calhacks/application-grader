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
export type Status = typeof Status.Type;

export const ApplicationEmail = Schema.Literal("Email");
export const ApplicationFirstName = Schema.Literal("First Name");
export const ApplicationLastName = Schema.Literal("Last Name");
export const ApplicationPhone = Schema.Literal("Phone");
export const ApplicationRole = Schema.Literal("Role");
export const ApplicationBirthday = Schema.Literal("Birthday");
export const ApplicationUniversity = Schema.Literal("University");
export const ApplicationMajorStudying = Schema.Literal("Major / studying");
export const ApplicationLevelOfStudy = Schema.Literal("Level of study");
export const ApplicationGraduationClass = Schema.Literal("Graduation class");
export const ApplicationCountry = Schema.Literal("Country");
export const ApplicationUnderrepresented = Schema.Literal("Underrepresented?");
export const ApplicationGender = Schema.Literal("Gender");
export const ApplicationRaceEthnicity = Schema.Literal("Race / ethnicity");
export const ApplicationPreviousHackathons = Schema.Literal(
	"Previous hackathons",
);
export const ApplicationLgbtq = Schema.Literal("LGBTQ?");
export const ApplicationBeenToCalHacksBefore = Schema.Literal(
	"Been to Cal Hacks before?",
);
export const ApplicationPreviousBerkeleyHackathons = Schema.Literal(
	"Previous Hackathons @ Berkeley events",
);
export const ApplicationReferrer = Schema.Literal("Referrer");
export const ApplicationFavouriteProject = Schema.Literal("Favourite project");
export const ApplicationPlannedProject = Schema.Literal("Planned project");
export const ApplicationTakeaways = Schema.Literal("Takeaways");
export const ApplicationGoal = Schema.Literal("Goal");
export const ApplicationJoke = Schema.Literal("Joke");
export const ApplicationGithub = Schema.Literal("GitHub");
export const ApplicationDevpost = Schema.Literal("Devpost");
export const ApplicationLinkedIn = Schema.Literal("LinkedIn");
export const ApplicationResume = Schema.Literal("Resume");
export const ApplicationEmployer = Schema.Literal("Employer");
export const ApplicationJobTitle = Schema.Literal("Job title");
export const ApplicationAreasOfExpertise = Schema.Literal("Areas of expertise");
export const ApplicationLookingForwardJudge = Schema.Literal(
	"Looking forward (judge)",
);
export const ApplicationPastProjectJudge = Schema.Literal(
	"Past project (judge)",
);
export const ApplicationVolunteerIntroduction = Schema.Literal(
	"Volunteer introduction",
);
export const ApplicationStatus = Schema.Literal("Status");
export const ApplicationReviewer1 = Schema.Literal("Reviewer 1");
export const ApplicationReviewer2 = Schema.Literal("Reviewer 2");
export const ApplicationReviewer3 = Schema.Literal("Reviewer 3");
export const ApplicationCreatedAt = Schema.Literal("Created at");
export const ApplicationReviewNeeded = Schema.Literal("Review needed");

export const ApplicationColumns = Schema.Union(
	ApplicationEmail,
	ApplicationFirstName,
	ApplicationLastName,
	ApplicationPhone,
	ApplicationRole,
	ApplicationBirthday,
	ApplicationUniversity,
	ApplicationMajorStudying,
	ApplicationLevelOfStudy,
	ApplicationGraduationClass,
	ApplicationCountry,
	ApplicationUnderrepresented,
	ApplicationGender,
	ApplicationRaceEthnicity,
	ApplicationPreviousHackathons,
	ApplicationLgbtq,
	ApplicationBeenToCalHacksBefore,
	ApplicationPreviousBerkeleyHackathons,
	ApplicationReferrer,
	ApplicationFavouriteProject,
	ApplicationPlannedProject,
	ApplicationTakeaways,
	ApplicationGoal,
	ApplicationJoke,
	ApplicationGithub,
	ApplicationDevpost,
	ApplicationLinkedIn,
	ApplicationResume,
	ApplicationEmployer,
	ApplicationJobTitle,
	ApplicationAreasOfExpertise,
	ApplicationLookingForwardJudge,
	ApplicationPastProjectJudge,
	ApplicationVolunteerIntroduction,
	ApplicationStatus,
	ApplicationReviewer1,
	ApplicationReviewer2,
	ApplicationReviewer3,
	ApplicationCreatedAt,
	ApplicationReviewNeeded,
);

export type ApplicationColumns = typeof ApplicationColumns.Type;

export const Application = Schema.Struct({
	id: Schema.String,
	email: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationEmail.literals[0]),
	),
	firstName: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationFirstName.literals[0]),
	),
	lastName: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationLastName.literals[0]),
	),
	phone: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationPhone.literals[0]),
	),
	role: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationRole.literals[0]),
	),
	birthday: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationBirthday.literals[0]),
	),
	university: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationUniversity.literals[0]),
	),
	majorStudying: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationMajorStudying.literals[0]),
	),
	levelOfStudy: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationLevelOfStudy.literals[0]),
	),
	graduationClass: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationGraduationClass.literals[0]),
	),
	country: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationCountry.literals[0]),
	),
	underrepresented: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationUnderrepresented.literals[0]),
	),
	gender: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationGender.literals[0]),
	),
	raceEthnicity: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationRaceEthnicity.literals[0]),
	),
	previousHackathons: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationPreviousHackathons.literals[0]),
	),
	lgbtq: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationLgbtq.literals[0]),
	),
	beenToCalHacks: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationBeenToCalHacksBefore.literals[0]),
	),
	previousBerkeleyHackathons: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationPreviousBerkeleyHackathons.literals[0]),
	),
	referrer: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationReferrer.literals[0]),
	),
	favouriteProject: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationFavouriteProject.literals[0]),
	),
	plannedProject: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationPlannedProject.literals[0]),
	),
	takeaways: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationTakeaways.literals[0]),
	),
	goal: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationGoal.literals[0]),
	),
	joke: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationJoke.literals[0]),
	),
	github: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationGithub.literals[0]),
	),
	devpost: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationDevpost.literals[0]),
	),
	linkedin: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationLinkedIn.literals[0]),
	),

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
	).pipe(Schema.fromKey(ApplicationResume.literals[0])),

	employer: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationEmployer.literals[0]),
	),
	jobTitle: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationJobTitle.literals[0]),
	),
	areasOfExpertise: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationAreasOfExpertise.literals[0]),
	),
	lookingForwardJudge: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationLookingForwardJudge.literals[0]),
	),
	pastProjectJudge: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationPastProjectJudge.literals[0]),
	),
	volunteerIntroduction: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationVolunteerIntroduction.literals[0]),
	),

	status: Schema.optional(Status).pipe(
		Schema.fromKey(ApplicationStatus.literals[0]),
	),
	reviewer1: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationReviewer1.literals[0]),
	),
	reviewer2: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationReviewer2.literals[0]),
	),
	reviewer3: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationReviewer3.literals[0]),
	),
	createdAt: Schema.optional(Schema.String).pipe(
		Schema.fromKey(ApplicationCreatedAt.literals[0]),
	),
	reviewNeeded: Schema.optional(Schema.Number).pipe(
		Schema.fromKey(ApplicationReviewNeeded.literals[0]),
	),
});

export type ApplicationType = typeof Application.Type;
export type ApplicationEncoded = typeof Application.Encoded;

export const Decision = Schema.Literal("accept", "reject");
export type Decision = typeof Decision.Type;

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
