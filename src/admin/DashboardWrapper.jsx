import Dashboard from './Dashboard';
export default function DashboardWrapper() {
  const shop=localStorage.getItem("shop") || "defaultShop";
  return <Dashboard shop={shop} />;
}