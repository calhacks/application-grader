"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="underline underline-offset-2 decoration-1 decoration-dotted decoration-black"
				>
					Applications Reviewed
					<ArrowUpDown className="ml-1 size-4" />
				</Button>
			);
		},
		accessorKey: "applications_reviewed",
	},
];
