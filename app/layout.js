import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://discoverai.predicta.au"),
  title: "AI Revenue Discovery — Predicta",
  description:
    "Find out exactly where AI can unlock new revenue in your business. Answer 12 adaptive questions and get a personalised AI Revenue Opportunity Map — free, in under 15 minutes.",
  keywords: [
    "AI revenue growth",
    "AI business opportunities",
    "AI strategy Australia",
    "AI revenue discovery",
    "how AI can grow my business",
    "AI revenue opportunities",
    "business AI strategy",
    "AI implementation Australia",
  ],
  authors: [{ name: "Louis Nonis", url: "https://predicta.au" }],
  creator: "Predicta",
  publisher: "Predicta",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Discover where AI can unlock new revenue in your business",
    description:
      "Answer 12 adaptive questions and get a free personalised AI Revenue Opportunity Map — specific to your business, not a generic playbook.",
    url: "https://discoverai.predicta.au",
    siteName: "Predicta — AI Revenue Generation",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Predicta — AI Revenue Discovery Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover where AI can unlock new revenue in your business",
    description:
      "Answer 12 adaptive questions and get a free personalised AI Revenue Opportunity Map.",
    images: ["/og-image.png"],
    creator: "@predicta_au",
  },
  alternates: {
    canonical: "https://discoverai.predicta.au",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/predicta-logo.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
