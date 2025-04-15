"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sendEmailAction } from "@/app/actions/email-actions"
import { useState } from "react"
import Link from "next/link"

export default function SendEmailPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await sendEmailAction(to, subject, body)
      setResult(response)
    } catch (error) {
      setResult({ success: false, error: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Send Email</h1>

        <Card>
          <CardHeader>
            <CardTitle>Send an Email via Gmail</CardTitle>
            <CardDescription>Use your connected Gmail account to send an email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
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
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Your message"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {result && (
              <div
                className={`p-4 w-full rounded-md ${
                  result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {result.success ? "Email sent successfully!" : `Error: ${result.error}`}
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6">
          <Link href="/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
