"use client";

import { useState } from "react";
import api from "../lib/api";

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirement: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await api.post("/leads", form);
      setStatus("Lead submitted successfully. Check your inbox for a confirmation email.");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        requirement: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white shadow-md rounded-3xl p-8 border border-slate-200">
      <h1 className="text-4xl font-bold text-slate-900 text-center mb-6">
        Lead Capture Form
      </h1>
      <p className="text-sm text-slate-600 text-center mb-6">
        Submit a lead and we will save it to the dashboard, send email tracking, and store analytics.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <textarea
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
          rows="5"
          name="requirement"
          placeholder="Requirement"
          value={form.requirement}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit Lead"}
        </button>
      </form>

      {status ? (
        <div className="mt-4 rounded-2xl bg-slate-100 border border-slate-200 p-4 text-sm text-slate-700">
          {status}
        </div>
      ) : null}
    </div>
  );
}