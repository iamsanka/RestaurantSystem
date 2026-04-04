"use client";

import { useEffect, useState } from "react";

type StatusRow = { status: string; count: number };
type DailyRow = { day: string; count: number };
type WeeklyRow = { week: string; count: number };

export default function AdminDashboardPage() {
  const [avgPrep, setAvgPrep] = useState<number>(0);
  const [byStatus, setByStatus] = useState<StatusRow[]>([]);
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [weekly, setWeekly] = useState<WeeklyRow[]>([]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) return;

    async function loadStats() {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [avgRes, statusRes, dailyRes, weeklyRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats/average-prep-time`,
          { headers },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats/orders-by-status`,
          { headers },
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats/daily`, {
          headers,
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats/weekly`, {
          headers,
        }),
      ]);

      const avgData = await avgRes.json();
      const statusData = await statusRes.json();
      const dailyData = await dailyRes.json();
      const weeklyData = await weeklyRes.json();

      if (avgData.success)
        setAvgPrep(avgData.averagePreparationTimeSeconds || 0);
      if (statusData.success) setByStatus(statusData.data || []);
      if (dailyData.success) setDaily(dailyData.data || []);
      if (weeklyData.success) setWeekly(weeklyData.data || []);
    }

    loadStats();
  }, []);

  function formatSeconds(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  return (
    <div>
      <h1 style={{ fontWeight: "bold", marginBottom: "30px" }}>
        Admin Dashboard
      </h1>

      {/* TOP STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "var(--forest-green)",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Average Prep Time
          </h2>
          <p>{formatSeconds(Math.round(avgPrep))}</p>
        </div>

        <div
          style={{
            background: "var(--forest-green)",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Orders by Status
          </h2>
          {byStatus.map((row) => (
            <p key={row.status}>
              {row.status}: {row.count}
            </p>
          ))}
        </div>

        <div
          style={{
            background: "var(--forest-green)",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Total Orders
          </h2>
          <p>{byStatus.reduce((sum, r) => sum + Number(r.count), 0)}</p>
        </div>
      </div>

      <hr style={{ borderColor: "#444", marginBottom: "30px" }} />

      {/* DAILY + WEEKLY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "var(--forest-green)",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Daily Orders
          </h2>
          {daily.map((row) => (
            <p key={row.day}>
              {row.day}: {row.count}
            </p>
          ))}
        </div>

        <div
          style={{
            background: "var(--forest-green)",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Weekly Orders
          </h2>
          {weekly.map((row) => (
            <p key={row.week}>
              {row.week}: {row.count}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
