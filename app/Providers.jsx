import { ThemeProvider } from "next-themes";
import SessionProvider from "./components/SessionProvider";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
