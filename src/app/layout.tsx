import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
// Import de la fuente de Google Fonts
import { Quicksand } from "next/font/google";
import NavBar from "@/components/NavBar";

// Fuente de Google Fonts
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quicksand",
})

export const metadata: Metadata = {
  title: "EXPOConfig 25/2",
  description: "Sistema gestor para la EXPOESCOM 25/2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          
      <body
        className={`${quicksand.variable} ${quicksand.variable} antialiased`}
      >
        <header>
          {/* <NavBar /> */}
        </header>
        <main>
          {children}
        </main> 
      </body>
    </html>
  );
}
