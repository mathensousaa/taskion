import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/configs/environment";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../database.types";

export const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!);
