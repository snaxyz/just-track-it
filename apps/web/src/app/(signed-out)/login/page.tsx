"use client";

import { Card, CardBody } from "@nextui-org/react";
import { DumbbellIcon, LogInIcon } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-stone-900">
      <Card
        className="w-full max-w-md mx-4 bg-zinc-100 dark:bg-stone-900"
        radius="lg"
        shadow="none"
      >
        <CardBody className="py-8 px-6 flex flex-col items-center gap-8">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="inline-block p-2 rounded-xl bg-primary/10 my-3">
              <DumbbellIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text font-semibold p-3">
              Welcome to <Logo className="text-2xl mt-2" />
            </h1>
          </div>

          {/* Login Button */}
          <a
            href="/auth/login?prompt=login"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-opacity w-full justify-center font-medium"
          >
            <LogInIcon size={18} />
            Sign in to continue
          </a>

          {/* Terms */}
          <p className="text-center text-xs text-default-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
