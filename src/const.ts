import * as path from "https://deno.land/std/path/mod.ts";

export const SHEETS = [
    "https://spreadsheets.google.com/feeds/cells/1oyesB6iW5zYveN5C-qvwvxpMUCpwMOP7h6psa39mlsM/4/public/full?alt=json",
    "https://spreadsheets.google.com/feeds/cells/1pD1or3qyg-PgT0Q_os-bTKwMr5WfoCY6CZ9AjAcpGqk/3/public/full?alt=json",
    "https://spreadsheets.google.com/feeds/cells/1oyesB6iW5zYveN5C-qvwvxpMUCpwMOP7h6psa39mlsM/3/public/full?alt=json"
]

export const GIF_REQUEST_URL_START = "https://www.bungie.net/pubassets/blarg/fragment_";

export const REGEX_FRAGMENT = /fragment_(?:v(\d+)(\w)?_)?(.{8}-.{4}-.{4}-.{4}-.{12})\.gif/g;
export const REGEX_FRAGMENT_FRAGMENT = 3
export const REGEX_FRAGMENT_VERSION = 1
export const REGEX_FRAGMENT_LAYER = 2

export const FILE_PATH = path.join(Deno.cwd(),  "/files/fragments");