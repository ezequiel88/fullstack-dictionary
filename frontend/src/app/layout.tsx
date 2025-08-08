import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("http://localhost:3000"),
  title: "Dictionary App - Dicionário Completo",
  description: "Aplicativo completo de dicionário com definições, pronúncia, favoritos e histórico. PWA que funciona offline com cache inteligente e instalação nativa.",
  applicationName: "Dictionary App",
  keywords: ["dicionário", "dictionary", "definições", "palavras", "inglês", "português", "PWA", "offline"],
  authors: [{ name: "Ezequiel Tavares", url: "https://github.com/ezequiel88" }],
  creator: "Ezequiel Tavares",
  publisher: "Dictionary App",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    description: "Aplicativo completo de dicionário com definições, pronúncia, favoritos e histórico. PWA que funciona offline com cache inteligente e instalação nativa.",
    siteName: "Dictionary App",
    url: "http://localhost:3000",
    locale: "pt_BR",
    images: [{ 
      url: "/icon-512.png",
      width: 512,
      height: 512,
      alt: "Dictionary App Logo"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dictionary App - Dicionário Completo",
    description: "Aplicativo completo de dicionário com definições, pronúncia, favoritos e histórico. PWA que funciona offline com cache inteligente e instalação nativa.",
    creator: "@ezequielTav",
    images: ["/icon-512.png"],
    site: "@dictionaryapp"
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#3b82f6"
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
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
