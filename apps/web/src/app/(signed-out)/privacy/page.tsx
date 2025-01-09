import { Logo } from "@/components/logo";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-stone-900">
      <div className="container mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <header className="text-center space-y-4 mb-16">
          <Logo className="text-3xl" />
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
          <p className="text-default-500">Last updated: December 17, 2024</p>
        </header>

        {/* Content */}
        <div className="space-y-12 prose dark:prose-invert max-w-none">
          <section>
            <p className="text-lg">
              This Privacy Policy describes our policies and procedures on the
              collection, use and disclosure of your information when you use
              Just track it and tells you about your privacy rights and how the
              law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect several different types of information for various
              purposes to provide and improve our Service to you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> When you register, we
                collect your name and email address through Google Sign-In.
              </li>
              <li>
                <strong>Workout Data:</strong> Information about your workouts,
                exercises, and fitness progress that you input into the app.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our
                service, including access times and pages viewed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support and respond to your requests</li>
              <li>
                To provide analysis or valuable information so that we can
                improve the service
              </li>
              <li>To monitor the usage of the service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p>
              The security of your data is important to us. We implement
              appropriate security measures to protect your personal
              information. However, please note that no method of transmission
              over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              We use Google Sign-In for authentication. When you choose to sign
              in using Google, their privacy policy applies to the information
              you provide to them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
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
