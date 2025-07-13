import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


function SpendingBarChart({orders}) {
  const [view, setView] = useState("shopname");
  const [data, setData] = useState([]);


  useEffect(() => {
    const now = new Date();

    const groupByShop = () => {
      const map = {};
      for (let order of orders) {
        for (let shop of order.ordersbyshop) {
          if (!map[shop.shopName]) map[shop.shopName] = 0;
          map[shop.shopName] += shop.shopTotal;
        }
      }
      return Object.entries(map).map(([shop, amount]) => ({
        name: shop,
        amount,
      }));
    };

    const groupByLast7Days = () => {
      const daily = Array(7).fill(0);
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        labels.push(day.toLocaleDateString("en-IN", { weekday: "short" }));
      }

      for (let order of orders) {
        const date = new Date(order.createdAt);
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff <= 6) {
          daily[6 - diff] += order.totalAmount;
        }
      }

      return labels.map((name, i) => ({ name, amount: daily[i] }));
    };

    const groupBy4Weeks = () => {
      const weekly = [0, 0, 0, 0];
      const start = new Date(now);
      start.setDate(start.getDate() - 28); // 4 weeks

      for (let order of orders) {
        const date = new Date(order.createdAt);
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff <= 27) {
          const week = Math.floor((27 - diff) / 7); // 0 to 3
          weekly[3 - week] += order.totalAmount;
        }
      }

      return weekly.map((amount, i) => ({
        name: `Week ${i + 1}`,
        amount,
      }));
    };

    const groupByMonth = () => {
      const monthly = Array(12).fill(0);
      for (let order of orders) {
        const date = new Date(order.createdAt);
        if (date.getFullYear() === now.getFullYear()) {
          const month = date.getMonth();
          monthly[month] += order.totalAmount;
        }
      }

      return monthly.map((amount, i) => ({
        name: new Date(0, i).toLocaleString("en-IN", { month: "short" }),
        amount,
      }));
    };

    if (view === "shopname") setData(groupByShop());
    else if (view === "lastweek") setData(groupByLast7Days());
    else if (view === "lastmonth") setData(groupBy4Weeks());
    else if (view === "lastyear") setData(groupByMonth());
  }, [orders, view]);

  return (
    <div className="card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Spending Chart</h5>
        <select
          className="form-select w-auto"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="shopname">By Shop</option>
          <option value="lastweek">Last Week</option>
          <option value="lastmonth">Last Month (4 weeks)</option>
          <option value="lastyear">Last Year (by month)</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => `₹${v}`} />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Bar dataKey="amount" fill="#007bff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingBarChart;
