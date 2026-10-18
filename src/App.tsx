import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import InvitationPage from "@/pages/InvitationPage";

const GuestLinkPage = lazy(() => import("@/pages/GuestLinkPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InvitationPage />} />
      <Route
        path="/buat-link"
        element={
          <Suspense fallback={<div className="min-h-screen bg-night" />}>
            <GuestLinkPage />
          </Suspense>
        }
      />
      <Route path="/:slug" element={<InvitationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
