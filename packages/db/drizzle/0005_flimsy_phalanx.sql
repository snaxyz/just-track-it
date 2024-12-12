ALTER TABLE "workout_exercise" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ADD COLUMN "exercise_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_set" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ADD CONSTRAINT "workout_session_exercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE no action ON UPDATE no action;