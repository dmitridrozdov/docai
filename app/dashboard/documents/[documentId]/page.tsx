"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDocumentButton } from "./delete-document-button";

export default function DocumentPage({
  params,
}: {
  params: {
    documentId: Id<"documents">;
  };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  return (
    <main className="space-y-8 w-full">
      {!document && (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-[40px] w-[500px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[40px] w-[80px]" />
            <Skeleton className="h-[40px] w-[80px]" />
          </div>
          <Skeleton className="h-[500px]" />
        </div>
      )}

      {document && (
        <main className="space-y-8 p-24">
            <div className="flex  items-center justify-between">
              <h1 className="text-4xl font-bold">{document.title}</h1>
            </div>
            
            {/* <Tabs defaultValue="document" className="w-[400px]">
              <TabsList className="">
                <TabsTrigger value="document">document</TabsTrigger>
                <TabsTrigger value="chat">chat</TabsTrigger>
              </TabsList>
              <TabsContent value="document">
                <div className="dark:bg-gray-900 bg-slate-100 flex flex-col gap-2 p-6 rounded-xl">
                  {document.documentUrl && (
                    <iframe src={document.documentUrl}  />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <ChatPanel documentId={document._id} />
              </TabsContent>
            </Tabs> */}

            {/* <DeleteDocumentButton documentId={document._id} /> */}

          <div className="flex gap-12">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="document">
                <div className="dark:bg-gray-900 bg-slate-100  p-4 rounded-xl flex-1 h-[500px]">
                  {document.documentUrl && (
                    <iframe
                      className="w-full h-full"
                      src={document.documentUrl}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <ChatPanel documentId={document._id} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}
    </main>
  );
}