import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600 font-semibold">Lead Management</p>
              <h1 className="mt-4 text-5xl font-bold text-slate-900">Capture leads, track emails, and grow your pipeline.</h1>
              <p className="mt-4 max-w-2xl text-slate-600 leading-7">
                Submit a lead using the form below. Your data is saved to MongoDB, a tracking email is sent, and opens/clicks are logged for analytics.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-white text-sm font-semibold shadow hover:bg-sky-700"
            >
              Open Dashboard
            </Link>
          </div>
        </section>

        <LeadForm />
      </div>
    </main>
  );
}
