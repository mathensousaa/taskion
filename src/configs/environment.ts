export const { NODE_ENV } = process.env;
export const URL = process.env.NEXT_PUBLIC_URL;

export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_TEST = NODE_ENV === "test";
export const IS_PRODUCTION = NODE_ENV === "production";

export const API_URL = process.env.API_URL;
export const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL;
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
