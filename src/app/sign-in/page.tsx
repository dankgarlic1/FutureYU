"use client";
import { signIn } from "next-auth/react";
export const Login = () => {
  return (
    <div>
      <button onClick={() => signIn("google")}>Sign In with Google</button>
      <br />
      <button onClick={() => signIn("github")}>Sign In with Github</button>
    </div>
  );
};
