import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ShetkariMitra AI", description: "Your farm. Your language. Your profit." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}