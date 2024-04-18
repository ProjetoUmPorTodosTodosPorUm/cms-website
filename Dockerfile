###################
# BASE IMAGE
###################
FROM node:21.7-alpine as base-image

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

###################
# PREVIEW IMAGE
###################
FROM base-image as preview-image

ARG PUBLIC_API_URL=https://api.localhost
ARG PUBLIC_FILES_URL=https://files.localhost
ARG PUBLIC_ASSETS_URL=https://assets.localhost/web
ARG PUBLIC_GOOGLE_MAP_API=AIzaSyABC1AW8m5olqyHRUgAlTli8kPzj1iij_0

ENV NODE_TLS_REJECT_UNAUTHORIZED 0
ENV BODY_SIZE_LIMIT 0
ENV ORIGIN https://cms.localhost
ENV NODE_ENV preview
WORKDIR /usr/src/app

RUN npx vite build && npm prune --production
RUN rm -rf /usr/src/app/src

USER node:node
EXPOSE 3000
CMD ["node", "build"]


###################
# PROD IMAGE
###################
FROM base-image as prod-image

ARG PUBLIC_API_URL=https://api.projetoumportodostodosporum.org
ARG PUBLIC_FILES_URL=https://files.projetoumportodostodosporum.org
ARG PUBLIC_ASSETS_URL=https://assets.projetoumportodostodosporum.org/web
ARG PUBLIC_GOOGLE_MAP_API=AIzaSyABC1AW8m5olqyHRUgAlTli8kPzj1iij_0

ENV BODY_SIZE_LIMIT 0
ENV ORIGIN https://cms.projetoumportodostodosporum.org
ENV NODE_ENV production
WORKDIR /usr/src/app

RUN npx vite build && npm prune --production
RUN rm -rf /usr/src/app/src

USER node:node
EXPOSE 3000
CMD ["node", "build"]
