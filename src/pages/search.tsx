import { AppLayout } from "@/components/app-layout";
import { SearchPanel } from "@/features/search";

export default function SearchPage() {
  return (
    <AppLayout crumbs={[{ label: "Search" }]} maxWidth="lg">
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight">Search uploads</h1>
        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <SearchPanel />
        </div>
      </div>
    </AppLayout>
  );
}
