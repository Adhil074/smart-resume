import { Suspense } from "react";
import UploadJDPage from "./UploadJDPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UploadJDPage />
    </Suspense>
  );
}