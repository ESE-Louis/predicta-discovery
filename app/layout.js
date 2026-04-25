import "./globals.css";

export const metadata = {
  title: "Predicta — AI Revenue Generation",
  description:
    "Discover where AI can generate new revenue in your business. 12 adaptive questions. One personalised opportunity map.",
  openGraph: {
    title: "Where is AI hiding revenue in your business?",
    description:
      "Answer 12 questions and get a personalised AI revenue opportunity map — specific to your situation.",
    url: "https://predicta.au",
    siteName: "Predicta — AI Revenue Generation",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
