ALTER TABLE "workout_session" ALTER COLUMN "started_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "workout_session" ALTER COLUMN "completed_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ALTER COLUMN "sets" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ALTER COLUMN "sets" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ALTER COLUMN "sets" SET NOT NULL;