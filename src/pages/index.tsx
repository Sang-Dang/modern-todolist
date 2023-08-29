import { Button, Divider, Input, Typography } from "antd";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { FaGoogle, FaShieldCat } from "react-icons/fa6";
import useMessageContext from "@/providers/MessageContext";

export default function Home() {
  const [api] = useMessageContext();

  function handleGoogleSignin() {
    signIn("google", { callbackUrl: "/home" })
      .then((val) => {
        if (val?.ok) {
          void api.open({ type: "success", content: "Login successful" });
        }
      })
      .catch((error) => {
        console.error(error);
        void api.open({
          type: "error",
          content: "Something happened on our side. Please try again later.",
        });
      });
  }

  return (
    <>
      <Head>
        <title>Todolist By Sang Dang</title>
        <meta name="description" content="A todo list application for users" />
      </Head>
      <div
        id="login-page"
        className="bg-login-hero grid h-screen w-screen place-items-center bg-cover bg-no-repeat"
      >
        <div
          id="login-dialog"
          className="h-max w-11/12 max-w-[400px] rounded-lg bg-slate-200 p-7 md:w-6/12"
        >
          <Typography.Title>Sign in</Typography.Title>
          <Button
            type="default"
            block
            icon={<FaGoogle />}
            className="mb-2"
            onClick={handleGoogleSignin}
          >
            Sign in with Google
          </Button>
          <Button
            type="default"
            block
            icon={<FaShieldCat />}
            onClick={() =>
              void api.open({ type: "success", content: "Login successful" })
            }
          >
            Sign in with Auth0
          </Button>
          <Divider>
            <Typography.Text>Or sign in with email</Typography.Text>
          </Divider>
          <Input placeholder="Email" className="mb-2" />
          <Button type="primary">Sign in</Button>
        </div>
      </div>
    </>
  );
}
