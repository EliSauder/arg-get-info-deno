import { IFragment } from "./IFragment.ts"

export interface IFragmentProperty {
    id: number;
    fragment?: IFragment;
    name: string;
    value?: string;
}