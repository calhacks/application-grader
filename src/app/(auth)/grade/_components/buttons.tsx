"use client";

import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { submitApplicationDecision } from "@/app/(auth)/grade/actions";
import { Button } from "@/components/ui/button";
import type { ReviewEncoded } from "@/schema/airtable";

interface SubmitButtonProps {
	fields: Pick<ReviewEncoded, "created_at" | "email" | "reviewer_id">;
}

export function AcceptButton(props: SubmitButtonProps) {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		"accept-button-key",
		(_, options: { arg: typeof props.fields }) =>
			submitApplicationDecision({ ...options.arg, decision: "accept" }),
	);

	async function handleAccept() {
		await trigger(props.fields);
		router.refresh();
	}

	return (
		<Button variant="default" disabled={isMutating} onClick={handleAccept}>
			Accept
		</Button>
	);
}

export function RejectButton(props: SubmitButtonProps) {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		"reject-button-key",
		(_, options: { arg: typeof props.fields }) =>
			submitApplicationDecision({ ...options.arg, decision: "reject" }),
	);

	async function handleReject() {
		await trigger(props.fields);
		router.refresh();
	}

	return (
		<Button
			variant="destructive"
			disabled={isMutating}
			onClick={handleReject}
		>
			Reject
		</Button>
	);
}

export function SkipButton() {
	return <Button variant="outline">Skip</Button>;
}
