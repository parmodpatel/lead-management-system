import "./globals.css";

export const metadata = {
  title: "Lead Management",
  description: "Lead Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}