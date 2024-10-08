"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function HeaderActions() {

  const createDocument = useMutation(api.documents.createDocument);

  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>

      <Authenticated>
        <UserButton />
        <button onClick={() => createDocument({title: "New Document"})}>click me</button>
      </Authenticated>

      <AuthLoading>Loading...</AuthLoading>
    </>
  );
}