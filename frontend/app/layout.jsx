import "./globals.css";

export const metadata = {
  title: "Convite Digital — Romântico Minimalista",
  description: "Personaliza, partilha um link e recebe RSVPs automaticamente.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
