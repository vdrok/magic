FROM node:8-slim
MAINTAINER Levuro AG

RUN apt-get update -y && apt-get install -y git

WORKDIR /tmp
COPY package.json /tmp/
RUN rm -rf /tmp/node_modules
RUN npm install
RUN npm install forever -g

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN rm -rf node_modules

RUN cp -a /tmp/node_modules /usr/src/app/

# set a health check
HEALTHCHECK --interval=5s \
            --timeout=5s \
            CMD curl -f http://127.0.0.1:3001 || exit 1

EXPOSE 3001
RUN npm rebuild
CMD npm run web-bundle && npm run web-server