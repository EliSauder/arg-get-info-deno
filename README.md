##### Note:
*This repo is no longer being updated as the ARG (Augmented Reality Game) from bungie was solved*
The solution can be viewed [here](https://www.reddit.com/r/raidsecrets/comments/jqiyeo/beyond_light_arg_solutiondecoded_sequence/).
The explanation of the process of finding the solution is [here](https://docs.google.com/document/d/e/2PACX-1vQfKH7zdQ3RJXSX1ZbTQxoJEhbK5SYGn3axBE7KwxI99mzsZpWiEwWeGVeI8JF3qhDDTmNEBQXI8tDC/pub)
I assisted in optimizing the substitution cypher to utilize multiple threads after the initial contributor developed it.
##### Info:
This projected was aimed at providing a central source of processing the data provided by bungie in the blarg (Beyond Light ARG), however, it was mostly a learning oportunity to learn about the deno runtime.
\
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
`deno run -c tsconfig.json --allow-net --allow-read --allow-write server.ts`