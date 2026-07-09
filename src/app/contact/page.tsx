import Link from "next/link";
import { Radio, ArrowLeft, Mail, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white">MEL Radio</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">Advertise</Link>
            <Link href="/contact" className="text-blue-400 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16 pb-24">
        <Link href="/" className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to player
        </Link>

        <h1 className="text-3xl font-bold text-white mb-3">Get in Touch</h1>
        <p className="text-zinc-400 mb-10">
          Interested in advertising? Have a question? Reach out and we&apos;ll get back to you.
        </p>

        <div className="grid gap-6 mb-12">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
            <Mail className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-medium">Email Us</h2>
              <p className="text-zinc-400 text-sm mt-1">advertise@melradio.com</p>
              <p className="text-zinc-500 text-xs mt-0.5">We reply within 24 hours</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
            <MessageSquare className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-medium">Contact Form</h2>
              <p className="text-zinc-400 text-sm mt-1">Fill out the form below and we&apos;ll reach out.</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </main>
    </div>
  );
}
