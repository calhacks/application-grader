import { Effect, Exit, Option } from "effect";
import { ThumbsUpIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EventStartDate } from "@/lib/constants";
import { findNewHackerApplication } from "@/lib/utils/airtable";
import { dateStringToDate, isAdult } from "@/lib/utils/util";

export default async function Grade() {
	const application = await findNewHackerApplication.pipe(
		Effect.runPromiseExit,
	);

	return (
		<main className="w-full h-full">
			<div className="p-4 flex justify-center">
				{Exit.match(application, {
					onFailure: (error) => <FailureAlert error={error} />,
					onSuccess: Option.match({
						onNone: () => (
							<FailureAlert error="No applications found" />
						),
						onSome: (application) => {
							const adult = application.birthday
								? isApplicantAdult(application.birthday)
								: false;

							return (
								<Card className="max-w-content w-3/4">
									<CardHeader>
										<CardTitle>
											Hacker Application
										</CardTitle>
										<CardDescription></CardDescription>
									</CardHeader>
									<CardContent>
										<div className="border-t border-neutral-200">
											<dl className="divide-y divide-neutral-200">
												{application.firstName && (
													<ApplicationField
														label="First Name"
														value={
															application.firstName
														}
													/>
												)}
												{application.lastName && (
													<ApplicationField
														label="Last Name"
														value={
															application.lastName
														}
													/>
												)}
												{application.role && (
													<ApplicationField
														label="Role"
														value={application.role}
													/>
												)}
												{application.birthday && (
													<ApplicationField
														label="Birthday"
														value={
															<Badge
																variant={
																	adult
																		? "outline"
																		: "destructive"
																}
															>
																{adult ? (
																	<ThumbsUpIcon />
																) : (
																	<XIcon />
																)}
																{
																	application.birthday
																}
															</Badge>
														}
													/>
												)}
												{application.university && (
													<ApplicationField
														label="University"
														value={
															application.university
														}
													/>
												)}
												{application.levelOfStudy && (
													<ApplicationField
														label="Level of Study"
														value={
															application.levelOfStudy
														}
													/>
												)}
												{application.graduationClass && (
													<ApplicationField
														label="Graduation Class"
														value={
															application.graduationClass
														}
													/>
												)}
												{application.country && (
													<ApplicationField
														label="Country"
														value={
															application.country
														}
													/>
												)}
												{application.referrer && (
													<ApplicationField
														label="Referrer"
														value={
															application.referrer
														}
													/>
												)}
												{application.favouriteProject && (
													<ApplicationField
														label="Favourite Project"
														value={
															application.favouriteProject
														}
													/>
												)}
												{application.plannedProject && (
													<ApplicationField
														label="Planned Project"
														value={
															application.plannedProject
														}
													/>
												)}
												{application.takeaways && (
													<ApplicationField
														label="Takeaways"
														value={
															application.takeaways
														}
													/>
												)}
												{application.goal && (
													<ApplicationField
														label="Goal"
														value={application.goal}
													/>
												)}
											</dl>
										</div>
									</CardContent>
								</Card>
							);
						},
					}),
				})}
			</div>
		</main>
	);
}

interface ApplicationFieldProps {
	label: string;
	value: ReactNode;
}

function ApplicationField(props: ApplicationFieldProps) {
	return (
		<div className="p-4 grid grid-cols-3 gap-4">
			<dt className="font-medium text-sm text-black">{props.label}</dt>
			<dd className="text-sm text-black/80 col-span-2">
				{props.value ?? "No response"}
			</dd>
		</div>
	);
}

interface FailureAlertProps {
	error?: any;
}

function FailureAlert(props: FailureAlertProps) {
	return (
		<Alert variant="destructive" className="w-[400px]">
			<AlertTitle>Error rendering application</AlertTitle>
			<AlertDescription>
				<p className="text-sm">
					Either there isn't any available applications or there was
					an error fetching the application. If there was an error,
					please send the trace below to Corey on Slack.
				</p>
				<pre className="w-full max-h-[250px] p-2 font-mono text-xs bg-neutral-100 rounded-md overflow-scroll">
					{JSON.stringify(props.error, null, 2)}
				</pre>
			</AlertDescription>
		</Alert>
	);
}

function isApplicantAdult(birthday: string) {
	return isAdult(
		dateStringToDate(birthday).pipe(Effect.runSync),
		EventStartDate,
	);
}
