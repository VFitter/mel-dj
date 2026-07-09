"use client";

import { useEffect, useState } from "react";
import { Mail, Inbox } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: number;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => (res.ok ? res.json() : []))
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Mail className="h-6 w-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
      </div>

      {loading ? (
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mt-16" />
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No messages yet.</p>
          <p className="text-xs mt-1">Inquiries from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-blue-400 text-sm hover:underline">{m.email}</a>
                </div>
                <span className="text-xs text-zinc-500">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">{m.subject}</div>
              <p className="text-zinc-300 text-sm whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
