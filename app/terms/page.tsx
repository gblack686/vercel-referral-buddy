import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service for Referral Buddy</h1>
        <p className="text-sm text-muted-foreground mb-6">Effective Date: Apr 01, 2025</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Referral Buddy ("the App"), you agree to these Terms of Service ("Terms"). If you do
              not agree with these Terms, you may not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Use of the App</h2>
            <p>The App is provided "as is" without warranties of any kind.</p>
            <p>You agree to use the App in compliance with all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Restrictions</h2>
            <p>You may not:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Use the App for any illegal or unauthorized purpose.</li>
              <li>Reverse engineer, decompile, or modify the App.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
            <p>
              The App and all associated content, including logos, trademarks, and designs, are the intellectual
              property of Gregory Black and may not be reproduced or used without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
            <p>
              We are not responsible for any damages or losses resulting from your use of the App. Use the App at your
              own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Modifications to the Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Any changes will be posted on this page with an
              updated effective date. By continuing to use the App, you accept any updates to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
            <p>If you have any questions about these Terms, you can contact us at:</p>
            <div className="mt-2">
              <p>Gregory Black</p>
              <p>Email: gblack686@gmail.com</p>
              <p>Website: referralbuddy.xyz</p>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
