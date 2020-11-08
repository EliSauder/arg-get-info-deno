import * as path from "https://deno.land/std/path/mod.ts";

export const SHEET_URL_1 = "https://spreadsheets.google.com/feeds/cells/1pD1or3qyg-PgT0Q_os-bTKwMr5WfoCY6CZ9AjAcpGqk/3/public/full?alt=json";
export const SHEET_URL_2 = "https://spreadsheets.google.com/feeds/cells/1oyesB6iW5zYveN5C-qvwvxpMUCpwMOP7h6psa39mlsM/3/public/full?alt=json";

export const GIF_REQUEST_URL_START = "https://www.bungie.net/pubassets/blarg/fragment_";

export const REGEX_FRAGMENT = /fragment_(?:v(\d+)_)?(.{8}-.{4}-.{4}-.{4}-.{12})\.gif/g;

export const FILE_PATH = path.join(Deno.cwd(),  "/files/fragments");