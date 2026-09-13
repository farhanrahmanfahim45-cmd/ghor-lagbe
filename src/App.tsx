import { BrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AppRoutes } from "@/routes/AppRoutes";
import { AppStateProvider } from "@/hooks/useAppState";
import { ToastProvider } from "@/components/ui/Toast";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <ToastProvider>
          <ScrollToTop />
          <AppShell>
            <AppRoutes />
          </AppShell>
        </ToastProvider>
      </AppStateProvider>
    </BrowserRouter>
  );
}
