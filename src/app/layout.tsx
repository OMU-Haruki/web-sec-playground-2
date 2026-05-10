import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/app/_components/Header";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import AuthProvider from "@/app/_contexts/AuthContext";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "WebSecPlayground",
  description: "...",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = async (props) => {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Header />
          <main className="mx-4 mt-2 max-w-3xl md:mx-auto">
            {props.children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
