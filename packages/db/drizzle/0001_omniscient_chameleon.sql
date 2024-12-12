ALTER TABLE "settings" RENAME TO "setting";--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout_session" ALTER COLUMN "started_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout_session" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout_session" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "setting" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "setting" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout_set" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workout_set" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "keywords" text[];--> statement-breakpoint
CREATE INDEX "exercise_created_at_idx" ON "exercise" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "exercise_updated_at_idx" ON "exercise" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "exercise_name_idx" ON "exercise" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "exercise_keywords_idx" ON "exercise" USING btree ("user_id","keywords");--> statement-breakpoint
CREATE INDEX "workout_created_at_idx" ON "workout" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "workout_updated_at_idx" ON "workout" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "workout_name_idx" ON "workout" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "workout_session_created_at_idx" ON "workout_session" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "workout_session_updated_at_idx" ON "workout_session" USING btree ("user_id","updated_at");