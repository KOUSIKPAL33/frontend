import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, isSameDay, isSameMonth, isSameYear,getMonth,getDate } from "date-fns";

function AdminStat({shop,orders }) {
  const today = new Date();
  const parsedOrders = orders.map((order) => ({
    ...order,
    createdAt: new Date(order.createdAt),
  }));

  const shopLower = shop.toLowerCase();

  // 🔹 Daily revenue for past 7 days
  const dailyStats = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    const total = parsedOrders
      .filter(
        (order) =>
          isSameDay(order.createdAt, date) &&
          order.shopOrder?.shopName?.toLowerCase() === shopLower
      )
      .reduce((sum, order) => sum + (order.shopOrder?.shopTotal || 0), 0);
    return {
      day: format(date, "EEE dd"),
      total,
    };
  });

  // 🔸 Monthly revenue (date-wise in current month)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthlyStats = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const total = parsedOrders
      .filter(
        (order) =>
          isSameMonth(order.createdAt, today) &&
          getDate(order.createdAt) === day &&
          order.shopOrder?.shopName?.toLowerCase() === shopLower
      )
      .reduce((sum, order) => sum + (order.shopOrder?.shopTotal || 0), 0);
    return {
      date: String(day).padStart(2, "0"),
      total,
    };
  });

  // 🔸 Yearly revenue (month-wise)
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const yearlyStats = Array.from({ length: 12 }).map((_, i) => {
    const total = parsedOrders
      .filter(
        (order) =>
          isSameYear(order.createdAt, today) &&
          getMonth(order.createdAt) === i &&
          order.shopOrder?.shopName?.toLowerCase() === shopLower
      )
      .reduce((sum, order) => sum + (order.shopOrder?.shopTotal || 0), 0);
    return {
      month: monthNames[i],
      total,
    };
  });

  return (
    <div className="card p-4">
      <h2 className="text-primary mb-4">Statistics</h2>

      {/* 🔹 Last 7 Days Revenue */}
      <h5 className="mb-2">🟦 Revenue - Last 7 Days</h5>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dailyStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#007bff" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* 🔸 Current Month Revenue (Date-wise) */}
      <h5 className="mt-4 mb-2">🟩  Revenue - This Month (Day-wise)</h5>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#28a745" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* 🔸 Current Year Revenue (Month-wise) */}
      <h5 className="mt-4 mb-2">🟨   Revenue - This Year (Month-wise)</h5>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={yearlyStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#ffc107" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminStat
