import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { PwaInstallBanner } from "@/components/pwa-banner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dictionary App",
  description: "Words and definitions",
  applicationName: "Dictionary",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dictionary"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ],
    other: [
      { rel: "shortcut icon", url: "/favicon.ico" }
    ]
  },
  openGraph: {
    type: "website",
    title: "Dictionary App",
    description: "Words and definitions",
    siteName: "Dictionary",
    url: "https://dictionary.com",
    images: [{ url: "https://dictionary.com/og.png" }]
  },
  twitter: {
    card: "summary",
    title: "Dictionary App",
    description: "Words and definitions",
    creator: "@ezequielTav",
    images: ["https://dictionary.com/og-twitter.png"],
    site: "https://dictionary.com"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-tap-highlight": "no"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                {children}
                <PwaInstallBanner />
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
