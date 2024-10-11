import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Doc } from "@/convex/_generated/dataModel";

  export function DocumentCard({ document }: { document: Doc<"documents"> }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
        <CardFooter>

        </CardFooter> 
        </Card>
    );
  } 