"use client";

import { Box, Card, CardContent } from "@mui/material";
import { DumbbellIcon, LogInIcon } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <Box
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-stone-900"
      component="div"
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "md",
          mx: 4,
          bgcolor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ py: 8, px: 6 }}>
          <Box className="flex flex-col items-center gap-8">
            {/* Logo & Title */}
            <Box className="text-center space-y-2">
              <Box className="inline-block p-2 rounded-xl bg-primary/10 my-3">
                <DumbbellIcon className="w-8 h-8 text-primary" />
              </Box>
              <Box component="h1" className="text font-semibold p-3">
                Welcome to <Logo className="text-2xl mt-2" />
              </Box>
            </Box>

            {/* Login Button */}
            <Box
              component="a"
              href="/auth/login?prompt=login"
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-opacity w-full justify-center font-medium"
            >
              <LogInIcon size={18} />
              Sign in to continue
            </Box>

            {/* Terms */}
            <Box component="p" className="text-center text-xs text-default-500">
              By continuing, you agree to our{" "}
              <Box component="a" href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Box>{" "}
              and{" "}
              <Box component="a" href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
