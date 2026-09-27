import { useEffect } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { Toaster } from "sonner";
import { isAuthenticated } from "@/lib/auth";
import LandingPage from "@/pages/landing";
import DemoTourPage from "@/pages/demo-tour";
import LoginPage from "@/pages/login";
import PortalHome from "@/pages/portal-home";
import NewLinkPage from "@/pages/new-link";
import DirectUploadPage from "@/pages/direct-upload";
import HistoryPage from "@/pages/history";
import SearchPage from "@/pages/search";
import RecordPage from "@/pages/record";
import CustomerUploadPage from "@/pages/customer-upload";
import UploadSuccessPage from "@/pages/upload-success";
import NotFound from "@/pages/not-found";

function Protected({ component: Component }: { component: () => React.JSX.Element }) {
  return isAuthenticated() ? <Component /> : <Redirect to="/login" />;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Routes() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/demo" component={DemoTourPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/portal">{() => <Protected component={PortalHome} />}</Route>
      <Route path="/portal/new-link">{() => <Protected component={NewLinkPage} />}</Route>
      <Route path="/portal/direct-upload">{() => <Protected component={DirectUploadPage} />}</Route>
      <Route path="/portal/history">{() => <Protected component={HistoryPage} />}</Route>
      <Route path="/portal/search">{() => <Protected component={SearchPage} />}</Route>
      <Route path="/portal/records/:uploadId">{() => <Protected component={RecordPage} />}</Route>
      <Route path="/upload/success" component={UploadSuccessPage} />
      <Route path="/upload/:token" component={CustomerUploadPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ScrollToTop />
      <Routes />
      <Toaster position="top-center" richColors closeButton />
    </WouterRouter>
  );
}
