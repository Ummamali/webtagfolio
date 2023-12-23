import SidePanel from "./layoutItems/SidePanel";

import "./dashboard.css";

const mainSectionRadius = "1.2rem";

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <div
      className="viewport h-screen"
      style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}
    >
      <SidePanel />
      <main className="font-light backdrop-blur-xl backdrop-brightness-60">
        <div
          className="overflow-hidden h-full"
          style={{
            borderTopLeftRadius: mainSectionRadius,
            borderBottomLeftRadius: mainSectionRadius,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
