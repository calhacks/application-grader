"use client";

import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { submitApplicationDecision } from "@/app/(auth)/grade/actions";
import { Button } from "@/components/ui/button";
import type { ApplicationEncoded, ReviewEncoded } from "@/schema/airtable";

interface SubmitButtonProps {
	applicationId: Pick<ApplicationEncoded, "id">;
	fields: Pick<ReviewEncoded, "email" | "created_at" | "reviewer_id">;
}

export function AcceptButton(props: SubmitButtonProps) {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		"accept-button-key",
		(_, options: { arg: SubmitButtonProps }) =>
			submitApplicationDecision(options.arg.applicationId, {
				...options.arg.fields,
				decision: "accept",
			}),
	);

	async function handleAccept() {
		await trigger(props);
		router.refresh();
	}

	return (
		<Button
			variant="default"
			size="sm"
			disabled={isMutating}
			onClick={handleAccept}
		>
			Accept
		</Button>
	);
}

export function RejectButton(props: SubmitButtonProps) {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		"reject-button-key",
		(_, options: { arg: SubmitButtonProps }) =>
			submitApplicationDecision(options.arg.applicationId, {
				...options.arg.fields,
				decision: "reject",
			}),
	);

	async function handleReject() {
		await trigger(props);
		router.refresh();
	}

	return (
		<Button
			variant="destructive"
			size="sm"
			disabled={isMutating}
			onClick={handleReject}
		>
			Reject
		</Button>
	);
}

export function SkipButton() {
	const router = useRouter();

	return (
		<Button variant="outline" size="sm" onClick={() => router.refresh()}>
			Skip
		</Button>
	);
}
