import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { PwaInstallBanner } from "@/components/pwa-banner";
import { PwaNotifications } from "@/components/pwa-notifications";
import { PwaProvider } from "@/components/pwa-provider";
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
  title: "Dictionary App - Dicionário Completo",
  description: "Aplicativo completo de dicionário com definições, favoritos e histórico. Funciona offline!",
  applicationName: "Dictionary App",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dictionary App",
    startupImage: [
      {
        url: "/icon-512.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  formatDetection: {
    telephone: false
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "shortcut icon", url: "/favicon.ico" },
      { rel: "mask-icon", url: "/icon-192.png", color: "#3b82f6" }
    ]
  },
  openGraph: {
    type: "website",
    title: "Dictionary App - Dicionário Completo",
    description: "Aplicativo completo de dicionário com definições, favoritos e histórico. Funciona offline!",
    siteName: "Dictionary App",
    url: "https://dictionary.com",
    images: [{ url: "https://dictionary.com/og.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dictionary App - Dicionário Completo",
    description: "Aplicativo completo de dicionário com definições, favoritos e histórico. Funciona offline!",
    creator: "@ezequielTav",
    images: ["https://dictionary.com/og-twitter.png"],
    site: "https://dictionary.com"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-tap-highlight": "no",
    "theme-color": "#3b82f6"
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
        <PwaProvider>
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
                <PwaNotifications />
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
