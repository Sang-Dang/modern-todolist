import { MessageContextProvider } from "@/providers/MessageContext";
import { NotificationContextProvider } from "@/providers/NotificationContext";
import "@/styles/globals.css";
import theme from "@/theme/themeConfig";
import { api } from "@/utils/api";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

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
