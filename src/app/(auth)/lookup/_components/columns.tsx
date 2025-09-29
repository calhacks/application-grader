"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ApplicationType } from "@/schema/airtable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

type ApplicationView = Pick<
	ApplicationType,
	| "birthday"
	| "country"
	| "email"
	| "firstName"
	| "graduationClass"
	| "lastName"
	| "levelOfStudy"
	| "majorStudying"
	| "role"
	| "university"
	| "status"
	| "createdAt"
	| "id"
>;

export const columns: ColumnDef<ApplicationView>[] = [
	{
	id: "actions",
	header: "Actions",
	cell: ({ row }) => {
		const application = row.original;

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">Update status</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={async () => {
							// update to accept
						}}
					>
						Accept
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={async () => {
							// update to rejected
						}}
					>
						Rejected
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={async () => {
							// update to confirmed
						}}
					>
						Confirmed
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "createdAt",
		header: "Priority",
		cell: ({ row }) => {
			const createdAt = row.getValue("createdAt") as string;
			// Cutoff: 9/24/25 12:00:00am PT = 9/24/25 07:00 UTC
			return new Date(createdAt) < new Date("2025-09-24T07:00:00.000Z") ? "Yes" : "No";
		},
	},
	{
		accessorKey: "firstName",
		header: "First Name",
	},
	{
		accessorKey: "lastName",
		header: "Last Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "birthday",
		header: "Birthday",
	},
	{
		accessorKey: "country",
		header: "Country",
	},
	{
		accessorKey: "role",
		header: "Role",
	},
	{
		accessorKey: "university",
		header: "University",
	},
	{
		accessorKey: "majorStudying",
		header: "Major",
	},
	{
		accessorKey: "graduationClass",
		header: "Graduation Class",
	},
	{
		accessorKey: "levelOfStudy",
		header: "Level of Study",
	},
];
