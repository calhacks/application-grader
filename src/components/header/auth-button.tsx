"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export interface AuthButtonProps {
	signedIn: boolean;
}

export function AuthButton(props: AuthButtonProps) {
	const router = useRouter();
	const supabase = createClient();

	function handleSignIn() {
		supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=/grade`,
			},
		});
	}

	function handleSignOut() {
		supabase.auth.signOut();
		router.refresh();
	}

	return (
		<Button
			variant="default"
			onClick={props.signedIn ? handleSignOut : handleSignIn}
		>
			{props.signedIn ? "Sign Out" : "Sign In"}
		</Button>
	);
}
