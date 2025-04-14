import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for Referral Buddy</h1>
        <p className="text-sm text-muted-foreground mb-6">Effective Date: Apr 1, 2025</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Introduction</h2>
            <p>
              Referral Buddy ("the App"), operated by Gregory Black ("we," "us," or "our"), is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our App. By accessing or using the App, you agree to the terms outlined in this Privacy
              Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p>We do not collect, store, or share any personal data from our users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p>
              Since we do not collect any personal information, we do not use or process personal data for any purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Sharing of Information</h2>
            <p>We do not share any personal information with third parties as we do not collect or store such data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p>
              While we do not handle personal data, we implement reasonable measures to ensure the security and
              integrity of our App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Children's Privacy</h2>
            <p>
              Our App is not intended for children under the age of 13. We do not knowingly collect any personal
              information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated effective date. By continuing to use the App, you accept any updates to this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
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
