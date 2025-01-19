ALTER TABLE "workout_session" ALTER COLUMN "completed_at" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "setting_user_id_key_idx" ON "setting" USING btree ("user_id","key");--> statement-breakpoint
ALTER TABLE "setting" DROP COLUMN "id";