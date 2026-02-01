"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [to, setTo] = useState("a6ee6@yahoo.com");
  const [subject, setSubject] = useState("Test Email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          htmlContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Email sent successfully!");
        setHtmlContent("");
        setTo("");
        setSubject("");
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to send email"}`);
      }
    } catch (error) {
      setMessage("❌ Error: Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">HTML Email Sender</h1>
          <p className="text-slate-600 dark:text-slate-400">Convert HTML with styles to inline CSS and send via SendGrid</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Email Details</CardTitle>
            <CardDescription>
              Paste your HTML content with &lt;style&gt; tags. It will be automatically converted to inline CSS before sending.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="to">Recipient Email</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="htmlContent">HTML Content</Label>
                <Textarea
                  id="htmlContent"
                  placeholder="<style>table { border-collapse: collapse; }</style><table><tr><td>Hello World</td></tr></table>"
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  required
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Include &lt;style&gt; tags in your HTML. They will be converted to inline styles automatically.
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Email"}
              </Button>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.includes("✅")
                      ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200"
                      : "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Example HTML:</h3>
          <pre className="text-xs bg-white dark:bg-slate-900 p-3 rounded overflow-x-auto">
            {`<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; }
  th { background-color: #4CAF50; color: white; }
</style>
<table>
  <tr><th>Name</th><th>Email</th></tr>
  <tr><td>John Doe</td><td>john@example.com</td></tr>
</table>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
