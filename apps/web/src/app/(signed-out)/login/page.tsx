"use client";

import { Box, Container, CssBaseline, Typography, Link, Card } from "@mui/material";
import { LogInIcon } from "lucide-react";
import { Logo } from "@/components/logo";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://justtrackitapp.com/">
        Just track it
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card variant="outlined" sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome to
            </Typography>
            <Logo sx={{ fontSize: "2rem", mt: 2 }} />
            <Typography variant="body1" sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
              Your AI-powered fitness companion.
            </Typography>
            <Link
              href="/auth/login?prompt=login"
              sx={{
                mt: 6,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1,
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                textDecoration: "none",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <LogInIcon size={18} />
              Sign in to continue
            </Link>
            <Typography variant="body2" color="text.secondary" align="center">
              By continuing, you agree to our{" "}
              <Link href="/terms" color="primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" color="primary">
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Card>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </Box>
  );
}
