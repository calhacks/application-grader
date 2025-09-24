import type { ReactNode } from "react";

interface ApplicationFieldProps {
	label: string;
	value: ReactNode;
}

export function ApplicationField(props: ApplicationFieldProps) {
	return (
		<div className="p-4 grid grid-cols-3 gap-4">
			<dt className="font-medium text-sm text-black">{props.label}</dt>
			<dd className="text-sm text-black/80 col-span-2">
				{props.value ?? "No response"}
			</dd>
		</div>
	);
}
