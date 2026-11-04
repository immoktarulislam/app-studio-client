"use client";

// import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}
