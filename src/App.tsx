import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import ApiSettings from "@/pages/ApiSettings";
import TranscriptionDetail from "@/pages/TranscriptionDetail";
import { SupabaseProvider } from "@/providers/SupabaseProvider";

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api-settings" element={<ApiSettings />} />
          <Route path="/transcription" element={<TranscriptionDetail />} />
        </Routes>
      </Router>
      <Toaster />
      <SonnerToaster />
    </SupabaseProvider>
  );
}

export default App;