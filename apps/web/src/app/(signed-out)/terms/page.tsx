import { Logo } from "@/components/logo";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-stone-900">
      <div className="container mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <header className="text-center space-y-4 mb-16">
          <Logo className="text-3xl" />
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
          <p className="text-default-500">Last updated: December 17, 2024</p>
        </header>

        {/* Content */}
        <div className="space-y-12 prose dark:prose-invert max-w-none">
          <section>
            <p className="text-lg">
              Welcome to Just track it. These terms and conditions outline the
              rules and regulations for the use of our website at
              https://justtrackitapp.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using our website, you accept and agree to be
              bound by the terms and provisions of these Terms of Service. If
              you do not agree to abide by the above, please do not use our
              website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
            <p>
              Before you continue using our website, we advise you to read our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                privacy policy
              </a>{" "}
              regarding our user data collection. It will help you better
              understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">User Account</h2>
            <p>
              To access features of our website, you are required to sign in
              using Google authentication. When you create an account with us,
              you guarantee that the information you provide is accurate,
              complete, and current at all times.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and for all activities that occur under your account. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">User Content</h2>
            <p>
              Our service allows you to input and store workout and fitness
              data. You retain full ownership of your content, and you are
              solely responsible for the data you input. You agree not to input
              any content that is unlawful, offensive, or inappropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Disclaimer of Warranties
            </h2>
            <p>
              The service is provided on an "as is" and "as available" basis.
              Just track it makes no warranties or representations about the
              accuracy or completeness of the website's content or the content
              of any sites linked to this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p>
              Just track it shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Changes to Terms of Service
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any changes by updating the "Last updated" date of
              these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:{" "}
              <a
                href="mailto:sna@snalabs.com"
                className="text-primary hover:underline"
              >
                sna@snalabs.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
