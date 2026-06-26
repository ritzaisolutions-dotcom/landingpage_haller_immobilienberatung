import { Suspense } from "react";
import { SkeletonList } from "@/components/ui/Skeleton";
import TermineContent from "./TermineContent";

export default function TermineRoute() {
  return (
    <Suspense fallback={<SkeletonList count={5} />}>
      <TermineContent />
    </Suspense>
  );
}
