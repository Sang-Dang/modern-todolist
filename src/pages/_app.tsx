import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import { NotificationContextProvider } from "@/providers/NotificationContext";
import { MessageContextProvider } from "@/providers/MessageContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ConfigProvider theme={theme}>
      <SessionProvider session={session}>
        <NotificationContextProvider>
          <MessageContextProvider>
            <Component {...pageProps} />
          </MessageContextProvider>
        </NotificationContextProvider>
      </SessionProvider>
    </ConfigProvider>
  );
};

export default api.withTRPC(MyApp);
