FROM node:21-alpine3.18 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm --filter=back build
RUN pnpm --filter=back --prod deploy ./prod/back
RUN pnpm --filter=front build

FROM base AS back
WORKDIR /usr/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/prod/back/build .
COPY --from=build /usr/src/app/prod/back/node_modules node_modules
EXPOSE 3333
CMD [ "pnpm", "start" ]

FROM base AS front
WORKDIR /usr/app
COPY --from=build /prod/front .