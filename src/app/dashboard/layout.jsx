import SidePanel from "../util/SidePanel";
import TopHeader from "../util/TopHeader";
import UsersBox from "../util/UsersBox";

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <div
      className="h-screen bg-mainDark py-4 px-6"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      <TopHeader />
      <div className="flex">
        <div
          className="w-64"
          style={{
            gridTemplateRows: "1fr auto",
            display: "grid",
            gap: "1.5rem",
          }}
        >
          <SidePanel />
          <UsersBox />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
