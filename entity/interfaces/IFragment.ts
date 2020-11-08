import { IFragmentProperty } from "./IFragmentProperty.ts";
import { IFragmentFile } from "./IFragmentFile.ts";

export interface IFragment {
    id: number;
    fragment: string;
    version: number;

    fileInfo?: IFragmentFile;
    properties?: IFragmentProperty[];
}