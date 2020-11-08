Most likely you will need a `tsconfig.json` in the root directory with the following content:

```json
{
  "compilerOptions": {
    "isolatedModules": false,
    "experimentalDecorators": true,
  }
}
```

Then you can run the app using:
`deno -c tsconfig.json --allow-net --allow-read --allow-write server.ts`