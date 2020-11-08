import { loadEnv } from "https://deno.land/x/dotenvfile/mod.ts";

interface IEnvStructure {
    RefreshRateMin:number;
    Host:string;
    Port:number;
    Database: {
        debug:boolean;
        name:string;
        username:string;
        password:string;
        dialect:"postgres"|"mysql";
        host:string;
        port:number;
    }
}

export const env = await loadEnv<IEnvStructure>();