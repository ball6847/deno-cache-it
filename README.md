deno-cache-it
=============

Simple script that read deno.lock and cache all listed dependencies

Useful for Dockerfile that need to a dependency layer caching

### Example

```sh
deno run --allow-read=deno.lock --allow-write=/tmp https://cdn.jsdelivr.net/gh/ball6847/deno-cache-it/main.ts
```

Dockerfile example

```dockerfile
FROM denoland/deno:alpine-1.35.1
WORKDIR /app

# cache dependencies layer
COPY deno.lock /app
RUN deno run --allow-read=deno.lock --allow-write=/tmp https://cdn.jsdelivr.net/gh/ball6847/deno-cache-it/main.ts
```
