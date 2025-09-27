"use client";

import { type ReactNode, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export interface StatisticsCardProps {
	statistics: Promise<{
		acceptedApplications: number;
		rejectedApplications: number;
		deferredApplications: number;
		applicationsBegan: number;
		totalApplications: number;
	}>;
}

export function StatisticsCard(props: StatisticsCardProps) {
	const statistics = use(props.statistics);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Priority Applications Progress</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-t border-neutral-200">
					<dl className="divide-y divide-neutral-200">
						<Statistic
							label="Accepted Applications"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.acceptedApplications},{" "}
										{(
											(statistics.acceptedApplications /
												statistics.applicationsBegan) *
											100
										).toFixed(1)}
										%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										accepted_applications /
										applications_began
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Rejected Applications"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.rejectedApplications},{" "}
										{(
											(statistics.rejectedApplications /
												statistics.applicationsBegan) *
											100
										).toFixed(1)}
										%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										rejected_applications /
										applications_began
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Deferred Applications"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.deferredApplications},{" "}
										{(
											(statistics.deferredApplications /
												statistics.applicationsBegan) *
											100
										).toFixed(1)}
										%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										deferred_applications /
										applications_began
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Applications Began"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.applicationsBegan},{" "}
										{(
											(statistics.applicationsBegan /
												statistics.totalApplications) *
											100
										).toFixed(1)}
										%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										applications_began / total_applications
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Total Priority Applications"
							value={statistics.totalApplications}
						/>
					</dl>
				</div>
			</CardContent>
		</Card>
	);
}

interface StatisticProps {
	label: string;
	value: ReactNode;
}

function Statistic(props: StatisticProps) {
	return (
		<div className="p-2 grid grid-cols-2 gap-2">
			<dt className="font-medium text-sm text-black">{props.label}</dt>
			<dd className="text-sm text-black/80">
				{props.value ?? "No response"}
			</dd>
		</div>
	);
}

export function StatisticsCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Priority Applications Progress</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-t border-neutral-200">
					<dl className="divide-y divide-neutral-200">
						<Statistic
							label="Accepted Applications"
							value={
								<span className="font-mono text-sm">
									loading...
								</span>
							}
						/>
						<Statistic
							label="Rejected Applications"
							value={
								<span className="font-mono text-sm">
									loading...
								</span>
							}
						/>
						<Statistic
							label="Deferred Applications"
							value={
								<span className="font-mono text-sm">
									loading...
								</span>
							}
						/>
						<Statistic
							label="Applications Began"
							value={
								<span className="font-mono text-sm">
									loading...
								</span>
							}
						/>
						<Statistic
							label="Total Applications"
							value={
								<span className="font-mono text-sm">
									loading...
								</span>
							}
						/>
					</dl>
				</div>
			</CardContent>
		</Card>
	);
}
