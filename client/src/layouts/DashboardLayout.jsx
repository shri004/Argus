import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-bg-0">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        <main className="container-page py-8 flex flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}
