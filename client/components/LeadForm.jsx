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
      setStatus("Lead submitted successfully. A confirmation email is on its way.");
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
    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-2xl text-white shadow-lg shadow-sky-100">
          ✉️
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Capture a New Lead</h1>
        <p className="mt-2 text-sm text-slate-600">
          Share your details and we’ll save it, send a personalized email, and track engagement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
          />
        </div>

        <textarea
          className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
          rows="5"
          name="requirement"
          placeholder="Tell us about your requirement"
          value={form.requirement}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Submitting..." : "Submit Lead"}
        </button>
      </form>

      {status ? (
        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${status.includes("success") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {status}
        </div>
      ) : null}
    </div>
  );
}