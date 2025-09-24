"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type LeaderboardView = {
	email: string;
	full_name: string;
	applications_reviewed: number;
};

export const columns: ColumnDef<LeaderboardView>[] = [
	{
		header: "Email",
		accessorKey: "email",
	},
	{
		header: "Full Name",
		accessorKey: "full_name",
	},
	{
		header: "Applications Reviewed",
		accessorKey: "applications_reviewed",
	},
];
