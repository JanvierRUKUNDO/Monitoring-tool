
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";
import Layout from "@/components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApplicationProvider>
    </AuthProvider>
  );
}
