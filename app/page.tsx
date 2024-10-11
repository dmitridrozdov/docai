"use client" //check you might delete later

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "./document-card";
import UploadDocumentButton from "./upload-document-button";

export default function Home() {

  const documents = useQuery(api.documents.getDocuments);
  // const createDocument = useMutation(api.documents.createDocument);
  
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Documents</h1>
        <UploadDocumentButton />
      </div>
      <div className="grid grid-cols-4 gap-8">
        {documents?.map((doc) => <DocumentCard document={doc} />)}
      </div>
    </main>
  );
}
