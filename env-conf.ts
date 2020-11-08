import { loadEnv } from "https://deno.land/x/dotenvfile/mod.ts";

interface IEnvStructure {
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
        filepath:string;
        uri:string;
    }
}

export const env = await loadEnv<IEnvStructure>();