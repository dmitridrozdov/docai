"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export function HeaderActions() {

  const documents = useQuery(api.documents.getDocuments);
  const createDocument = useMutation(api.documents.createDocument);

  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>

      <Authenticated>
        <UserButton />
        <Button onClick={() => createDocument({title: "New Document"})}>click me</Button>
        
      </Authenticated>

      <AuthLoading>Loading...</AuthLoading>
      {documents?.map((doc) => <div>{doc.title}</div>)}
    </>
  );
}