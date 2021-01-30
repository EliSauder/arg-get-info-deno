import { REGEX_FRAGMENT, SHEETS, GIF_REQUEST_URL_START, FILE_PATH, REGEX_FRAGMENT_FRAGMENT, REGEX_FRAGMENT_LAYER, REGEX_FRAGMENT_VERSION } from "./const.ts"
import { fragmentFileRepository, fragmentRepository } from "../server.ts";
import { Fragment } from "../entity/FragmentEntity.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { createHash } from "https://deno.land/std@0.67.0/hash/mod.ts";
import { FragmentFile } from "../entity/FragmentFileEntity.ts";
import { isNull, isUndefined } from "https://deno.land/std@0.70.0/encoding/_yaml/utils.ts";

let refreshesInProgress = 0;

export async function main() {

    if (refreshesInProgress > 0) {
        console.log("Refresh is already in progress.");
        return;
    }

    try {

        const promises:Promise<unknown>[] = [];

        for(let i = 0; i < SHEETS.length; i++) {
            promises.push(fetchSheetInfo(SHEETS[i]))
        }

        await Promise.all(promises);
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
        const fragment = match[REGEX_FRAGMENT_FRAGMENT];
        const version = isUndefined(match[REGEX_FRAGMENT_VERSION]) ? 1 : parseInt(match[REGEX_FRAGMENT_VERSION]);
        const layerString = match[REGEX_FRAGMENT_LAYER];
        
        let layer:number = 0;

        if (isUndefined(layerString)) {
            layer = 1;
        } else {
            let charLayer:number = layerString.toLowerCase().charCodeAt(0);
            charLayer = charLayer - 97 + 1;

            layer = charLayer;
        }

        await processResultMatch(fragment, version, layer);
    }

    refreshesInProgress--;
}

async function processResultMatch(fragment:string, version:number, layer:number) {

    const fragmentEntity = await fragmentRepository.findOne({ where: {fragment: fragment, version: version, layer: layer}, relations:["fileInfo"]});

    if (isUndefined(fragmentEntity)) {

        const fragmentEntityNew = new Fragment();
        fragmentEntityNew.fragment = fragment;
        fragmentEntityNew.version = version;
        fragmentEntityNew.layer = layer;

        const createdFragment:Fragment = await fragmentRepository.save(fragmentEntityNew);
        
        await processFragmentFetch(createdFragment);

    } else if ((isUndefined(fragmentEntity.fileInfo) || isNull(fragmentEntity.fileInfo))&& fragmentEntity.timesTried < 3) {
        await processFragmentFetch(fragmentEntity);
    }
}

async function processFragmentFetch(fragment:Fragment) {
    let requestUrl = GIF_REQUEST_URL_START;

    if (fragment.version == 1) {
        requestUrl = `${requestUrl}${fragment.fragment}.gif`;
    } else {
        if (fragment.layer > 1) {
            requestUrl = `${requestUrl}v${fragment.version}${String.fromCharCode(fragment.layer + 97 - 1)}_${fragment.fragment}.gif`;
        } else {
            requestUrl = `${requestUrl}v${fragment.version}_${fragment.fragment}.gif`;
        }
    }

    const response = await fetch(requestUrl);

    if (response.status > 100 && response.status < 299) {

        if (fragment.hasError) {
            fragment.hasError = false;
            fragment.error = null;
            await fragmentRepository.save(fragment);
        }
        
        await processFragmentFile(fragment, new Uint8Array(await response.arrayBuffer()), response.headers.get("content-type"));

    } else {
        fragment.hasError = true;
        fragment.error = response.status + " - " + response.statusText;
        fragment.timesTried++;
        await fragmentRepository.save(fragment);
    }
}

async function processFragmentFile(fragment:Fragment, data:Uint8Array, contentType:string|null) {

    const filePath = path.join(FILE_PATH, `/${fragment.fragment}_v${fragment.version}_l${fragment.layer}.gif`);

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

    await fragmentRepository.save(fragment);
    await fragmentFileRepository.save(fragmentFile);
}