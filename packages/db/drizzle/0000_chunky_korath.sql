CREATE TABLE "exercise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"categories" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"has_sets" boolean DEFAULT true NOT NULL,
	"has_reps" boolean DEFAULT true NOT NULL,
	"has_weight" boolean DEFAULT true NOT NULL,
	"has_duration" boolean DEFAULT false NOT NULL,
	CONSTRAINT "exercise_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "workout" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workout_id" uuid,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workout_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_session_exercise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workout_session_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"sets" json DEFAULT '[]'::json NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_id_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ADD CONSTRAINT "workout_session_exercise_workout_session_id_workout_session_id_fk" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_session_exercise" ADD CONSTRAINT "workout_session_exercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exercise_created_at_idx" ON "exercise" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "exercise_updated_at_idx" ON "exercise" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "exercise_name_idx" ON "exercise" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "exercise_keywords_idx" ON "exercise" USING btree ("user_id","keywords");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_name_user_id_idx" ON "exercise" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "workout_created_at_idx" ON "workout" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "workout_updated_at_idx" ON "workout" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "workout_name_idx" ON "workout" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_name_user_id_idx" ON "workout" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_slug_user_id_idx" ON "workout" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX "workout_session_created_at_idx" ON "workout_session" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "workout_session_updated_at_idx" ON "workout_session" USING btree ("user_id","updated_at");