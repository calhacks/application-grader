import { Effect, Exit, Option } from "effect";
import { ThumbsUpIcon, XIcon } from "lucide-react";
import {
	AcceptButton,
	RejectButton,
	SkipButton,
} from "@/app/(auth)/grade/_components/buttons";
import { ApplicationField } from "@/components/description/application";
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
import { createClient } from "@/lib/supabase/server";
import { findNewHackerApplication } from "@/lib/utils/airtable";
import { SupabaseUser } from "@/lib/utils/supabase";
import { dateStringToDate, isAdult } from "@/lib/utils/util";

export default async function Grade() {
	const supabase = await createClient();
	const user = await SupabaseUser(supabase).pipe(Effect.runPromise);
	const application = await findNewHackerApplication.pipe(
		Effect.runPromiseExit,
	);

	return (
		<main className="w-full h-full">
			<div className="p-8 flex justify-center">
				{Exit.match(application, {
					onFailure: (error) => <FailureAlert error={error} />,
					onSuccess: Option.match({
						onNone: () => (
							<FailureAlert error="No applications found" />
						),
						onSome: (application) => {
							if (!application.email) {
								return (
									<FailureAlert error="No email provided" />
								);
							}

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
												<ApplicationField
													label="First Name"
													value={
														application.firstName
													}
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
												<ApplicationField
													label="University"
													value={
														application.university
													}
												/>
												<ApplicationField
													label="Level of Study"
													value={
														application.levelOfStudy
													}
												/>
												<ApplicationField
													label="Graduation Class"
													value={
														application.graduationClass
													}
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
													value={
														application.favouriteProject
													}
												/>
												<ApplicationField
													label="Planned Project"
													value={
														application.plannedProject
													}
												/>
												<ApplicationField
													label="Takeaways"
													value={
														application.takeaways
													}
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
													created_at:
														new Date().toISOString(),
													reviewer_id: user.id,
												}}
											/>
											<RejectButton
												fields={{
													email: application.email,
													created_at:
														new Date().toISOString(),
													reviewer_id: user.id,
												}}
											/>
											<SkipButton />
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
					{JSON.stringify(props.error ?? "No error message", null, 2)}
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
