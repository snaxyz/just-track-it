CREATE TABLE "workout_exercise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "has_sets" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "has_reps" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "has_weight" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "has_duration" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE no action ON UPDATE no action;