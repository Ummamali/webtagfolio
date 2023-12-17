import SidePanel from "../util/SidePanel";
import TopHeader from "../util/TopHeader";

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <div className="h-screen bg-mainDark p-4">
      <TopHeader />
      <div className="flex ">
        <div>
          <SidePanel />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
