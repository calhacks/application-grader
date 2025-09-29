"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ApplicationType } from "@/schema/airtable";
import { Badge } from "@/components/ui/badge";

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
>;

export const columns: ColumnDef<ApplicationView>[] = [
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
