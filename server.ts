import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { createConnection } from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/src/index.ts";
import { env } from "./env-conf.ts";
import { Scheduler } from "./src/Scheduler.ts";
import { main } from "./src/main.ts";
import { Fragment } from "./entity/FragmentEntity.ts";
import { FragmentFile } from "./entity/FragmentFileEntity.ts";
import { ensureDir } from "https://deno.land/std@0.70.0/fs/ensure_dir.ts";
import { FILE_PATH } from "./src/const.ts";

await ensureDir(FILE_PATH);

const app = new Application();

const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

const refreshProcess:Scheduler = new Scheduler(main, env.RefreshRateMin);

export const connection = await createConnection({
    type: env.Database.dialect,
    host: env.Database.host,
    port: env.Database.port,
    username: env.Database.username,
    password: env.Database.password,
    database: env.Database.name,
    entities: [
        "entity/*Entity.ts"
    ],
    migrations: [
        "migration/*Migration.ts"
    ],
    subscribers: [
        "subscriber/*Subscriber.ts"
    ],
    synchronize: true
});

export const fragmentRepository = connection.getRepository(Fragment);
export const fragmentFileRepository = connection.getRepository(FragmentFile);

await refreshProcess.run();