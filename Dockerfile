FROM node:21-alpine3.18 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run -r build
RUN pnpm deploy --filter=back --prod /prod/back
RUN pnpm deploy --filter=front --prod /prod/front

FROM base AS back
ENV NODE_ENV=production
COPY --from=build /prod/back /prod/back
WORKDIR /prod/back
EXPOSE 3333
CMD [ "pnpm", "start" ]

FROM base AS front
COPY --from=build /prod/front /prod/front
WORKDIR /prod/front