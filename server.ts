import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { createConnection } from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/src/index.ts";
import { env } from "./env-conf.ts"

const app = new Application();

const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

await createConnection({
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