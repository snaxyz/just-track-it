import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // url: config.database.url,
    url: "postgresql://postgres.clubihdvoqtxcadcjdnk:NksF5Mmgr_UteE4@aws-0-us-west-1.pooler.supabase.com:5432/postgres",
    ssl: false,
  },
  verbose: true,
});
