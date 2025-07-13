import ShowOrders from './Showorders';
export default function ShowOrdersWrapper() {
  const shop=localStorage.getItem("shop") || "defaultShop";
  return <ShowOrders shop={shop} />;
}