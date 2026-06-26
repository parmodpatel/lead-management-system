"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data.data);
      } catch (err) {
        setError("Unable to load dashboard data.");
        console.error(err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Track leads, email opens, clicks, and engagement metrics.</p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-700"
          >
            Back to Lead Form
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">
            {error}
          </div>
        )}

        {!stats ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {[
                { label: "Total Leads", value: stats.totalLeads },
                { label: "Emails Sent", value: stats.emailsSent },
                { label: "Opened", value: stats.opened },
                { label: "Clicked", value: stats.clicked },
                { label: "Open Rate", value: `${stats.openRate}%` },
                { label: "Click Rate", value: `${stats.clickRate}%` },
              ].map((card) => (
                <div key={card.label} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Recent Leads</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 text-sm text-slate-500">Name</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-sm text-slate-500">Email</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-sm text-slate-500">Opened</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-sm text-slate-500">Clicked</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-sm text-slate-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentLeads.map((lead) => (
                      <tr key={lead._id} className="odd:bg-slate-50">
                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{lead.name}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{lead.email}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{lead.opened ? "Yes" : "No"}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{lead.clicked ? "Yes" : "No"}</td>
                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{new Date(lead.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
