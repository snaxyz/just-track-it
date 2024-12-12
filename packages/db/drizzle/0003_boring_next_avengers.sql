CREATE TABLE "workout_session_exercise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_session_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ADD CONSTRAINT "workout_session_exercise_workout_session_id_workout_session_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting" DROP COLUMN "ui";