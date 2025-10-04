"use client";

import type { User } from "@supabase/supabase-js";
import { Effect } from "effect";
import { ThumbsUpIcon, XIcon } from "lucide-react";
import { use } from "react";
import { FailureAlert } from "@/app/(auth)/grade/_components/alert";
import {
	HackerAcceptButton,
	HackerRejectButton,
	JudgeAcceptButton,
	JudgeRejectButton,
	SkipButton,
} from "@/app/(auth)/grade/_components/buttons";
import { ApplicationField } from "@/components/description/application";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventStartDate } from "@/lib/constants";
import { dateStringToDate, isAdult } from "@/lib/utils/util";
import type { ApplicationType } from "@/schema/airtable";

export interface ApplicationCardProps {
	application: Promise<ApplicationType | null>;
	reviewer: User;
}

export function HackerApplicationCard(props: ApplicationCardProps) {
	const application = use(props.application);

	if (!application) {
		return (
			<FailureAlert error="Application not found. Either grading is done, you grade too much, or Corey wrote a bug." />
		);
	}

	if (!application.email) {
		return <FailureAlert error="No email provided" />;
	}

	const adult = application.birthday
		? isApplicantAdult(application.birthday)
		: false;

	return (
		<Card className="max-w-content w-full sm:w-3/4">
			<CardHeader>
				<CardTitle>Hacker Application</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-t border-neutral-200">
					<dl className="divide-y divide-neutral-200">
						<ApplicationField
							label="First Name"
							value={application.firstName}
						/>
						<ApplicationField
							label="Last Name"
							value={application.lastName}
						/>
						<ApplicationField
							label="Email"
							value={application.email}
						/>
						<ApplicationField
							label="Role"
							value={application.role}
						/>
						<ApplicationField
							label="Birthday"
							value={
								<Badge
									variant={adult ? "outline" : "destructive"}
								>
									{adult ? <ThumbsUpIcon /> : <XIcon />}
									{application.birthday}
								</Badge>
							}
						/>
						<ApplicationField
							label="University"
							value={application.university}
						/>
						<ApplicationField
							label="Level of Study"
							value={application.levelOfStudy}
						/>
						<ApplicationField
							label="Graduation Class"
							value={application.graduationClass}
						/>
						<ApplicationField
							label="Country"
							value={application.country}
						/>
						<ApplicationField
							label="Referrer"
							value={application.referrer}
						/>
						<ApplicationField
							label="Favourite Project"
							value={application.favouriteProject}
						/>
						<ApplicationField
							label="Planned Project"
							value={application.plannedProject}
						/>
						<ApplicationField
							label="Takeaways"
							value={application.takeaways}
						/>
						<ApplicationField
							label="Goal"
							value={application.goal}
						/>
						<ApplicationField
							label="Joke"
							value={application.joke}
						/>
					</dl>
				</div>

				<div className="flex flex-row gap-4 pt-4 border-t border-neutral-200">
					<HackerAcceptButton
						applicationId={{ id: application.id }}
						fields={{
							email: application.email,
							created_at: new Date().toISOString(),
							reviewer_id: props.reviewer.id,
						}}
					/>
					<HackerRejectButton
						applicationId={{ id: application.id }}
						fields={{
							email: application.email,
							created_at: new Date().toISOString(),
							reviewer_id: props.reviewer.id,
						}}
					/>
					<SkipButton />
				</div>
			</CardContent>
		</Card>
	);
}

export function JudgeApplicationCard(props: ApplicationCardProps) {
	const application = use(props.application);

	if (!application) {
		return (
			<FailureAlert error="Application not found. Either grading is done, you grade too much, or Corey wrote a bug." />
		);
	}

	if (!application.email) {
		return <FailureAlert error="No email provided" />;
	}

	return (
		<Card className="max-w-content w-full sm:w-3/4">
			<CardHeader>
				<CardTitle>Judge Application</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-t border-neutral-200">
					<dl className="divide-y divide-neutral-200">
						<ApplicationField
							label="First Name"
							value={application.firstName}
						/>
						<ApplicationField
							label="Last Name"
							value={application.lastName}
						/>
						<ApplicationField
							label="Email"
							value={application.email}
						/>
						<ApplicationField
							label="Role"
							value={application.role}
						/>
						<ApplicationField
							label="Previous hackathons?"
							value={application.previousHackathons}
						/>
						<ApplicationField
							label="Previous H@B hackathons?"
							value={application.previousBerkeleyHackathons}
						/>
						<ApplicationField
							label="Referrer"
							value={application.referrer}
						/>
						<ApplicationField
							label="Employer"
							value={application.employer}
						/>
						<ApplicationField
							label="Job title"
							value={application.jobTitle}
						/>
						<ApplicationField
							label="Areas of expertise"
							value={application.areasOfExpertise}
						/>
						<ApplicationField
							label="Looking forward to..."
							value={application.lookingForwardJudge}
						/>
						<ApplicationField
							label="Past projects"
							value={application.pastProjectJudge}
						/>
					</dl>
				</div>

				<div className="flex flex-row gap-4 pt-4 border-t border-neutral-200">
					<JudgeAcceptButton
						applicationId={{ id: application.id }}
						fields={{
							email: application.email,
							created_at: new Date().toISOString(),
							reviewer_id: props.reviewer.id,
						}}
					/>
					<JudgeRejectButton
						applicationId={{ id: application.id }}
						fields={{
							email: application.email,
							created_at: new Date().toISOString(),
							reviewer_id: props.reviewer.id,
						}}
					/>
					<SkipButton />
				</div>
			</CardContent>
		</Card>
	);
}

function isApplicantAdult(birthday: string) {
	return isAdult(
		dateStringToDate(birthday).pipe(Effect.runSync),
		EventStartDate,
	);
}
