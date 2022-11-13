FROM node:16.17-alpine AS builder

ENV YARM_VERSION 1.22.19

RUN apk --no-cache add curl

RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz

# Create app directory
WORKDIR /app-service

COPY package.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY yarn.lock ./

RUN  yarn global add @nestjs/cli
# Install app dependencies
RUN yarn install
# Build app
RUN yarn build

COPY . .

CMD [ "yarn", "run", "start:dev" ]