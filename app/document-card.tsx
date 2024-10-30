import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Doc } from "@/convex/_generated/dataModel";
  import { Eye, Loader2 } from "lucide-react";
  import Link from "next/link";

  export function DocumentCard({ document }: { document: Doc<"documents"> }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
            <p>Card content</p>
        </CardContent>
        <CardFooter>
            <Button variant="secondary">
            <Link href={`/dashboard/documents/${document._id}`}>
                <Eye className="w-4 h-4" /> View
            </Link>
            </Button>
        </CardFooter> 
        </Card>
    );
  } 