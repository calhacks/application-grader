"use client";

import type { User } from "@supabase/supabase-js";
import { Effect } from "effect";
import { ThumbsUpIcon, XIcon } from "lucide-react";
import { use } from "react";
import { FailureAlert } from "@/app/(auth)/grade/_components/alert";
import {
	AcceptButton,
	RejectButton,
	SkipButton,
} from "@/app/(auth)/grade/_components/buttons";
import { ApplicationField } from "@/components/description/application";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EventStartDate } from "@/lib/constants";
import { dateStringToDate, isAdult } from "@/lib/utils/util";
import type { ApplicationType } from "@/schema/airtable";

export interface ApplicationCardProps {
	application: Promise<ApplicationType>;
	reviewer: Promise<User>;
}

export function ApplicationCard(props: ApplicationCardProps) {
	const application = use(props.application);
	const reviewer = use(props.reviewer);

	if (!application.email) {
		return <FailureAlert error="No email provided" />;
	}

	const adult = application.birthday
		? isApplicantAdult(application.birthday)
		: false;

	return (
		<Card className="max-w-content w-3/4">
			<CardHeader>
				<CardTitle>Hacker Application</CardTitle>
				<CardDescription></CardDescription>
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
					</dl>
				</div>

				<div className="flex flex-row gap-4 pt-4 border-t border-neutral-200">
					<AcceptButton
						fields={{
							email: application.email,
							created_at: new Date().toISOString(),
							reviewer_id: reviewer.id,
						}}
					/>
					<RejectButton
						fields={{
							email: application.email,
							created_at: new Date().toISOString(),
							reviewer_id: reviewer.id,
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
