import Showdata from './Showdata';
export default function ShowdataWrapper() {
  const shop=localStorage.getItem("shop") || "defaultShop";
  return <Showdata shop={shop} />;
}