"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { updateHackerApplicationStatus } from "@/app/(auth)/lookup/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type ApplicationType,
	StatusAccept,
	StatusConfirmed,
	StatusRejected,
} from "@/schema/airtable";

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
		cell: ({ row }) => {
			const application = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreHorizontalIcon className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="min-w-[200px]">
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								Update status
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<form
										action={() => {
											toast.promise(
												updateHackerApplicationStatus(
													application.id,
													StatusAccept.literals[0],
												),
												{
													loading:
														"Updating status...",
													success: () =>
														`${application.email ?? "`Email not found`"} status updated to: ${StatusAccept.literals[0]}`,
													error: () =>
														`Something went wrong when updating status for: ${application.email ?? "`Email not found`"}`,
												},
											);
										}}
									>
										<Button
											type="submit"
											variant="ghost"
											size={null}
											className="w-full justify-start"
										>
											<DropdownMenuItem className="w-full">
												Accept
											</DropdownMenuItem>
										</Button>
									</form>
									<form
										action={() => {
											toast.promise(
												updateHackerApplicationStatus(
													application.id,
													StatusRejected.literals[0],
												),
												{
													loading:
														"Updating status...",
													success: () =>
														`${application.email ?? "`Email not found`"} status updated to: ${StatusRejected.literals[0]}`,
													error: () =>
														`Something went wrong when updating status for: ${application.email ?? "`Email not found`"}`,
												},
											);
										}}
									>
										<Button
											type="submit"
											variant="ghost"
											size={null}
											className="w-full justify-start"
										>
											<DropdownMenuItem className="w-full">
												Rejected
											</DropdownMenuItem>
										</Button>
									</form>
									<form
										action={() => {
											toast.promise(
												updateHackerApplicationStatus(
													application.id,
													StatusConfirmed.literals[0],
												),
												{
													loading:
														"Updating status...",
													success: () =>
														`${application.email ?? "`Email not found`"} status updated to: ${StatusConfirmed.literals[0]}`,
													error: () =>
														`Something went wrong when updating status for: ${application.email ?? "`Email not found`"}`,
												},
											);
										}}
									>
										<Button
											type="submit"
											variant="ghost"
											size={null}
											className="w-full justify-start"
										>
											<DropdownMenuItem className="w-full">
												Confirmed
											</DropdownMenuItem>
										</Button>
									</form>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			);
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
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "createdAt",
		header: "Priority",
		cell: ({ row }) => {
			const createdAt = row.getValue("createdAt") as string;
			// Cutoff: 9/24/25 12:00:00am PT = 9/24/25 07:00 UTC
			return new Date(createdAt) < new Date("2025-09-24T07:00:00.000Z")
				? "Yes"
				: "No";
		},
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
