import { IFragment } from "./IFragment.ts"

export interface IFragmentProperty {
    id: number;
    fragment: IFragment|undefined;
    name: string;
    value?: string;
}