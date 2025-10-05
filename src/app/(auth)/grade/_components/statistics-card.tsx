"use client";

import { type ReactNode, use } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HackerStatisticsCardProps {
	statistics: Promise<{
		acceptedApplications: number;
		rejectedApplications: number;
		deferredApplications: number;
		applicationsBegan: number;
		regularRoundApplications: number;
		totalApplications: number;
	}>;
}

export function HackerStatisticsCard(props: HackerStatisticsCardProps) {
	const statistics = use(props.statistics);

	const acceptedPercentage = (
		(statistics.acceptedApplications / statistics.applicationsBegan) *
		100
	).toFixed(1);
	const rejectedPercentage = (
		(statistics.rejectedApplications / statistics.applicationsBegan) *
		100
	).toFixed(1);
	const applicationsBeganPercentage = (
		(statistics.applicationsBegan / statistics.regularRoundApplications) *
		100
	).toFixed(1);
	const applicationsLeftPercentage = (
		((statistics.regularRoundApplications - statistics.applicationsBegan) /
			statistics.regularRoundApplications) *
		100
	).toFixed(1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Applications Progress</CardTitle>
				<CardDescription>
					<b>Note:</b> Current decision criteria is{" "}
					<span className="font-mono">1 Accept</span> or{" "}
					<span className="font-mono">2 Reject</span>.
				</CardDescription>
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
										{acceptedPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										accepted_applications /
										regular_round_applications
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
										{rejectedPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										rejected_applications /
										regular_round_applications
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										Deferred Applications
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										deferred priority applicants
									</TooltipContent>
								</Tooltip>
							}
							value={statistics.deferredApplications}
						/>
						<Statistic
							label="Applications Began"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.applicationsBegan},{" "}
										{applicationsBeganPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										applications_began /
										regular_round_applications
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Applications Left"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.regularRoundApplications -
											statistics.applicationsBegan}
										, {applicationsLeftPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										(regular_round_applications -
										applications_began) /
										regular_round_applications
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										Regular Round Applications
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										# of applications submitted during
										regular round
									</TooltipContent>
								</Tooltip>
							}
							value={statistics.regularRoundApplications}
						/>
						<Statistic
							label={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										Total Applications
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										total # of applications submitted
									</TooltipContent>
								</Tooltip>
							}
							value={statistics.totalApplications}
						/>
					</dl>
				</div>
			</CardContent>
		</Card>
	);
}

export interface JudgeStatisticsCardProps {
	statistics: Promise<{
		acceptedApplications: number;
		rejectedApplications: number;
		applicationsBegan: number;
		totalApplications: number;
	}>;
}

export function JudgeStatisticsCard(props: JudgeStatisticsCardProps) {
	const statistics = use(props.statistics);

	const acceptedPercentage = (
		(statistics.acceptedApplications / statistics.totalApplications) *
		100
	).toFixed(1);
	const rejectedPercentage = (
		(statistics.rejectedApplications / statistics.totalApplications) *
		100
	).toFixed(1);
	const applicationsBeganPercentage = (
		(statistics.applicationsBegan / statistics.totalApplications) *
		100
	).toFixed(1);
	const applicationsLeftPercentage = (
		((statistics.totalApplications - statistics.applicationsBegan) /
			statistics.totalApplications) *
		100
	).toFixed(1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Applications Progress</CardTitle>
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
										{acceptedPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										accepted_applications /
										total_applications
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
										{rejectedPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										rejected_applications /
										total_applications
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
										{applicationsBeganPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										applications_began / total_applications
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Applications Left"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.totalApplications -
											statistics.applicationsBegan}
										, {applicationsLeftPercentage}%
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										(total_applications -
										applications_began) / total_applications
									</TooltipContent>
								</Tooltip>
							}
						/>
						<Statistic
							label="Total Applications"
							value={
								<Tooltip>
									<TooltipTrigger className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black">
										{statistics.totalApplications}
									</TooltipTrigger>
									<TooltipContent className="font-mono">
										Total # of applications submitted
									</TooltipContent>
								</Tooltip>
							}
						/>
					</dl>
				</div>
			</CardContent>
		</Card>
	);
}

interface StatisticProps {
	label: ReactNode;
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
				<CardTitle>
					<Skeleton className="h-4 w-40" />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-t border-neutral-200">
					<dl className="divide-y divide-neutral-200">
						<Statistic
							label={<Skeleton className="h-4 w-15" />}
							value={<Skeleton className="h-4 w-40" />}
						/>
						<Statistic
							label={<Skeleton className="h-4 w-15" />}
							value={<Skeleton className="h-4 w-40" />}
						/>
						<Statistic
							label={<Skeleton className="h-4 w-15" />}
							value={<Skeleton className="h-4 w-40" />}
						/>
						<Statistic
							label={<Skeleton className="h-4 w-15" />}
							value={<Skeleton className="h-4 w-40" />}
						/>
					</dl>
				</div>
			</CardContent>
		</Card>
	);
}
