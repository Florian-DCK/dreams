import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ModalProviders from '@/components/modals/providers';
import ConditionalNavbar from '@/components/conditional-navbar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Dreams',
	description: 'Mon carnet de lecture',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ModalProviders>
					<ConditionalNavbar />
					{children}
				</ModalProviders>
			</body>
		</html>
	);
}
