import { IFragment } from "./IFragment.ts"

export interface IFragmentFile {
    id:number;
    fragment:IFragment|undefined;
    filePath:string;
    fileType:string;
    md5:string;
    sha1:string;
}