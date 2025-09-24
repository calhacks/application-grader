import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface FailureAlertProps {
	error?: any;
}

export function FailureAlert(props: FailureAlertProps) {
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
