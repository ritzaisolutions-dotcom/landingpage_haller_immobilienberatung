import { Suspense } from "react";
import { SkeletonList } from "@/components/ui/Skeleton";
import AnfragenPage from "./AnfragenContent";

export default function AnfragenRoute() {
  return (
    <Suspense fallback={<SkeletonList count={6} />}>
      <AnfragenPage />
    </Suspense>
  );
}
