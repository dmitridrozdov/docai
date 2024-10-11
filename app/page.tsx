"use client" //check you might delete later

import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "./document-card";

export default function Home() {

  const documents = useQuery(api.documents.getDocuments);
  const createDocument = useMutation(api.documents.createDocument);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
      </Authenticated>
      <Button onClick={() => createDocument({title: "New Document"})}>click me</Button>
      <div className="grid grid-cols-4 gap-8">
        {documents?.map((doc) => <DocumentCard document={doc} />)}
      </div>
    </main>
  );
}
