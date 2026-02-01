"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, CheckCircle, AlertCircle, Code, Sparkles, Eye, X } from "lucide-react";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handlePreview = async () => {
    if (!htmlContent) return;

    try {
      const response = await fetch("/api/preview-html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent }),
      });

      const data = await response.json();

      if (response.ok) {
        setPreviewHtml(data.inlinedHtml);
        setShowPreview(true);
        setMessage("");
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to preview HTML"}`);
      }
    } catch (error) {
      console.error("Preview error:", error);
      setMessage("❌ Error: Failed to preview HTML");
    }
  };

  const sendEmail = async (htmlToSend: string, resetForm: boolean = false) => {
    setLoading(true);
    setMessage("");

    // Anti-bot check: if honeypot field is filled, reject silently
    if (honeypot) {
      setMessage("❌ Error: Invalid submission detected");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          htmlContent: htmlToSend,
          honeypot,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Email sent successfully!");
        if (resetForm) {
          setHtmlContent("");
          setTo("");
          setSubject("");
        }
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to send email"}`);
      }
    } catch (error) {
      console.error("Send email error:", error);
      setMessage("❌ Error: Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    await sendEmail(htmlContent, true);
  };

  const handleSendFromPreview = async () => {
    await sendEmail(previewHtml, false);
    // Close preview after successful send (message is already set by sendEmail)
    if (message.includes("✅")) {
      setTimeout(() => {
        setShowPreview(false);
        setPreviewHtml("");
        setHtmlContent("");
        setTo("");
        setSubject("");
      }, 2000);
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewHtml("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600" />
            StyleSend
          </CardTitle>
          <CardDescription className="text-lg">Transform HTML with styles into beautiful emails with inline CSS</CardDescription>
        </div>

        {/* Preview View */}
        {showPreview ? (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold">Inline CSS Result</CardTitle>
                  <CardDescription className="text-base mt-1">HTML markup after CSS inlining transformation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Processed HTML
                  </Label>
                  <Textarea value={previewHtml} readOnly className="min-h-[400px] font-mono text-sm resize-none" />
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This is the HTML markup with inline CSS that will be sent to the email recipients.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleSendFromPreview}
                    disabled={loading}
                    className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Email
                      </div>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelPreview}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Back to Edit
                  </Button>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      message.includes("✅")
                        ? "bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {message.includes("✅") ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">{message}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Main Form Card */
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold">Compose Email</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Add your HTML content with styles - we'll handle the conversion automatically
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendEmail();
                }}
                className="space-y-8"
              >
                {/* Recipient Email */}
                <div className="space-y-3">
                  <Label htmlFor="to" className="text-base font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Recipient Email
                  </Label>
                  <Input
                    id="to"
                    type="email"
                    placeholder="recipient@example.com"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-base font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>

                {/* HTML Content */}
                <div className="space-y-3">
                  <Label htmlFor="htmlContent" className="text-base font-medium flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    HTML Content
                  </Label>
                  <Textarea
                    id="htmlContent"
                    placeholder="<style>table { border-collapse: collapse; }</style><table><tr><td>Hello World</td></tr></table>"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    required
                    className="min-h-[320px] font-mono text-sm resize-none"
                  />
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Include &lt;style&gt; tags in your HTML. They will be automatically converted to inline styles for maximum email
                      client compatibility.
                    </p>
                  </div>
                </div>

                {/* Honeypot field - hidden from users, catches bots */}
                <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <Input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading || !htmlContent || !to || !subject}
                    className="flex-1 h-12 text-base font-medium cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Email
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={handlePreview}
                    disabled={!htmlContent || loading}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium cursor-pointer border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </div>
                  </Button>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      message.includes("✅")
                        ? "bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {message.includes("✅") ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">{message}</div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
