import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Trinity Church Billing | திரித்துவ ஆலயம்",
  description: "Church member billing and contribution management system for Trinity Church, Pandarampatti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#f0f0f5',
              border: '1px solid #2a2a40',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#00b894',
                secondary: '#1a1a2e',
              },
            },
            error: {
              iconTheme: {
                primary: '#e74c3c',
                secondary: '#1a1a2e',
              },
            },
          }}
        />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
