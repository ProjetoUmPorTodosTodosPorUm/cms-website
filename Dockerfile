## Build Args
ARG PUBLIC_API_URL=http://api.projetoumportodostodosporum.org
ARG PUBLIC_STATIC_PATH=/static
ARG PUBLIC_GOOGLE_MAP_API=AIzaSyABC1AW8m5olqyHRUgAlTli8kPzj1iij_0
ARG MODE=production

###################
# BASE IMAGE
###################
FROM node:19.4-alpine as base-image

ARG PUBLIC_API_URL
ARG PUBLIC_STATIC_PATH
ARG PUBLIC_GOOGLE_MAP_API
ARG MODE

# Needed for build
RUN apk add git
RUN git config --global --add safe.directory /usr/src/app

# Create APP directory
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy Necessary Files (static/src etc)
COPY . . 

# Creates Production Bundle
RUN npx vite build --mode ${MODE} && npm prune --production

###################
# PREVIEW IMAGE
###################
FROM node:19.4-alpine As preview-image
USER node:node

ENV BODY_SIZE_LIMIT=0
ENV ORIGIN=http://cms.localhost
ENV NODE_ENV preview
WORKDIR /usr/src/app

# Needed Files
COPY --from=base-image --chown=node:node /usr/src/app/build ./build
COPY --from=base-image --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json ./

EXPOSE 3002
CMD ["node", "build"]

###################
# PROD IMAGE
###################
FROM node:19.4-alpine As prod-image
USER node:node

ENV BODY_SIZE_LIMIT=0
# https://kit.svelte.dev/docs/adapter-node#environment-variables-origin-protocolheader-and-hostheader
ENV ORIGIN=https://cms.projetoumportodostodosporum.org
ENV NODE_ENV production
WORKDIR /usr/src/app

# Needed Files
COPY --from=base-image --chown=node:node /usr/src/app/build ./build
COPY --from=base-image --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json ./

EXPOSE 3002
CMD ["node", "build"]
