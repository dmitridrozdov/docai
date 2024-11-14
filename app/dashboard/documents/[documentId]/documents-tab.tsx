import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export function DocumentsTab() {
    return (
        <Tabs defaultValue="document" className="w-full">
            <TabsList>
                <TabsTrigger value="document">
                    document
                </TabsTrigger>
                <TabsTrigger value="chat">
                    chat
                </TabsTrigger>
                <TabsContent value="document">changes to document here</TabsContent>
                <TabsContent value="chat">changes to chat here</TabsContent>
            </TabsList>
        </Tabs>
    )
    

}