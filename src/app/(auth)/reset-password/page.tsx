import Image from "next/image";
import ResetPassword from "../_component/ResetPassword";
import { PagePropsWithSearchParams } from "@/lib/types";


const ResetPasswordPage = async ({ searchParams }: PagePropsWithSearchParams) => {

  const searchParamsData = await searchParams;
  const token = searchParamsData.token;
  const toEmail = searchParamsData.to;

  return (
    <>
      {token && typeof token === "string" ? (
        <div className="grid gap-6">
          <ResetPassword token={token} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-1">
          <div className="relative mb-4 w-60 h-60 text-muted-foreground">
            <Image src="/email-sent.png" fill alt="Email sent message" />
          </div>

          <h3 className="text-2xl font-semibold">Check your email</h3>

          {toEmail ? (
            <p className="text-center text-muted-foreground">
              We&apos;ve sent a password reset email to{" "}
              <span className="font-semibold">{toEmail}</span>.
            </p>
          ) : (
            <p className="text-center text-muted-foreground">
              We&apos;ve sent a password reset link to your email
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ResetPasswordPage;
