import { REGEX_FRAGMENT, SHEET_URL_1, SHEET_URL_2, GIF_REQUEST_URL_START, FILE_PATH } from "./const.ts"
import { connection, fragmentFileRepository, fragmentRepository } from "../server.ts";
import { Fragment } from "../entity/FragmentEntity.ts";
import { isNull, isUndefined } from "https://deno.land/std@0.70.0/encoding/_yaml/utils.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { createHash } from "https://deno.land/std@0.67.0/hash/mod.ts";
import { hash } from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/src/util/StringUtils.ts";
import { FragmentFile } from "../entity/FragmentFileEntity.ts";

let refreshesInProgress = 0;

export async function main() {

    if (refreshesInProgress > 0) {
        console.log("Refresh is already in progress.");
        return;
    }

    try {
        await Promise.all(
            [ 
                fetchSheetInfo(SHEET_URL_1),
                fetchSheetInfo(SHEET_URL_2)
            ]
        );
    }
    catch (error) {
        console.log("Error requesting sheets: main()");
        console.log(error);
    }
}

async function fetchSheetInfo(url:string) {
    const result = await fetch(url);
    await processSheetInfo(result);
} 

async function processSheetInfo(res:Response) {
    refreshesInProgress++;

    let count:number = 0;

    const bodyText:string = await res.text();

    const matchAll = [...bodyText.matchAll(REGEX_FRAGMENT)];

    if (matchAll.length === 0) {
        console.log("No matches found");
        refreshesInProgress--;
        return;
    }

    for (let i = 0; count < matchAll.length; i++) {
        const match = matchAll[i];
        count++;
        await processResultMatch(match[2], isUndefined(match[1]) ? 1 : parseInt(match[1]));
    }

    refreshesInProgress--;
}

async function processResultMatch(fragment:string, version:number) {

    const fragmentEntity = await fragmentRepository.findOne({ where: {fragment: fragment, version: version}});

    if (isUndefined(fragmentEntity)) {

        const fragmentEntityNew = new Fragment();
        fragmentEntityNew.fragment = fragment;
        fragmentEntityNew.version = version;

        const createdFragment:Fragment = await fragmentRepository.save(fragmentEntityNew);
        
        await processFragmentFetch(createdFragment);
    }
}

async function processFragmentFetch(fragment:Fragment) {
    let requestUrl = GIF_REQUEST_URL_START;

    if (fragment.version == 1) {
        requestUrl = `${requestUrl}${fragment.fragment}.gif`;
    } else {
        requestUrl = `${requestUrl}v${fragment.version}_${fragment.fragment}.gif`;
    }

    const response = await fetch(requestUrl);

    if (response.status > 100 && response.status < 299) {
        await processFragmentFile(fragment, new Uint8Array(await response.arrayBuffer()), response.headers.get("content-type"));

    } else {
        fragment.hasError = true;
        fragment.error = response.statusText;

        fragmentRepository.save(fragment);
    }
}

async function processFragmentFile(fragment:Fragment, data:Uint8Array, contentType:string|null) {

    const filePath = path.join(FILE_PATH, `/${fragment.fragment}_v${fragment.version}.gif`);

    await Deno.writeFile(filePath, data);

    const md5Hash = createHash("md5");
    md5Hash.update(data);

    const sha1Hash = createHash("sha1");
    sha1Hash.update(data);

    const fragmentFile = new FragmentFile();
    fragmentFile.filePath = filePath;
    fragmentFile.fileType = contentType!;
    fragmentFile.md5 = md5Hash.toString();
    fragmentFile.sha1 = sha1Hash.toString();

    fragmentFile.fragment = fragment;

    fragment.fileInfo = fragmentFile;

    fragmentRepository.save(fragment);
    fragmentFileRepository.save(fragmentFile);
}