import { IFragmentProperty } from "./IFragmentProperty.ts";
import { IFragmentFile } from "./IFragmentFile.ts";

export interface IFragment {
    id: number;
    fragment: string;
    version: number;
    layer: number;
    hasError: boolean;
    error: string|null;

    fileInfo?: IFragmentFile;
    properties?: IFragmentProperty[];
}