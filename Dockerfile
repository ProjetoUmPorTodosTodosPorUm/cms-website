## ENVS
ARG PUBLIC_API_URL=http://api.projetoumportodostodosporum.org
ARG PUBLIC_STATIC_PATH=/static

###################
# BASE IMAGE
###################
FROM node:19.3-alpine as base-image

ARG PUBLIC_API_URL
ARG PUBLIC_STATIC_PATH

# Fix Unable to establish a connection to query-engine-node-api library. It seems there is a problem with your OpenSSL installation!
# https://github.com/prisma/prisma/issues/14073#issuecomment-1348534199
RUN apk add --update --no-cache openssl1.1-compat

# Create APP directory
WORKDIR /usr/src/app

# Copy APP dependencies
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

# Install Dependencies
RUN npm ci

# Bundle APP source
COPY --chown=node:node . . 

# Run the build command which creates the production bundle
RUN npx vite build

###################
# DEV IMAGE
###################
FROM base-image as dev-image

ARG PUBLIC_API_URL
ARG PUBLIC_STATIC_PATH

# Set NODE_ENV environment variable
ENV NODE_ENV development

USER node
EXPOSE 3000
CMD ["node", "build"]

###################
# PROD IMAGE
###################
FROM base-image as prod-image

ARG PUBLIC_API_URL
ARG PUBLIC_STATIC_PATH

# Set NODE_ENV environment variable
ENV NODE_ENV production

USER node
EXPOSE 3000
CMD ["node", "build"]
