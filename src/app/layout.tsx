import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header/header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const berkeleyMono = localFont({
	src: "../assets/fonts/berkeley.ttf",
	variable: "--font-berkeley",
});

export const metadata: Metadata = {
	title: "H@B Grader",
	description: "Ethan was not here",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${berkeleyMono.variable} antialiased`}
			>
				<Header />
				{children}
			</body>
		</html>
	);
}
