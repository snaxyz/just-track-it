import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import { HeartIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
      <Stack spacing={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              About Just Track It
            </Typography>
            <Typography paragraph>
              Just Track It is a minimalist workout tracking app designed to help you focus on what matters most: your
              fitness journey. Built with simplicity and privacy in mind, it helps you track your workouts without the
              unnecessary complexity.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Stack spacing={1}>
              <Typography>• Custom exercise library</Typography>
              <Typography>• AI workout assistant</Typography>
              <Typography>• Privacy-focused design</Typography>
              <Typography>• Personalized workout tracking</Typography>
              <Typography>• Progress analytics</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Technology
            </Typography>
            <Typography paragraph>
              Built with modern technologies including Next.js, TypeScript, and AI capabilities powered by Claude AI.
              The app is designed to be fast, reliable, and secure.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Privacy
            </Typography>
            <Typography paragraph>
              Your data belongs to you. We prioritize your privacy and security, ensuring your workout data is stored
              securely and you maintain full control over your information.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Made with <HeartIcon size={16} style={{ display: "inline", verticalAlign: "center" }} /> by
            </Typography>
            <Typography paragraph>
              Just Track It is developed and maintained by SNA LABS Corp. Feel free to reach out with questions,
              feedback, or suggestions through the feedback form.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
