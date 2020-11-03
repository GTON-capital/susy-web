FROM node:13-alpine as susy-web

WORKDIR /susy

COPY src /susy/src
COPY tsconfig.json vue-shim.d.ts nuxt.config.js package-lock.json package.json /susy/

RUN apk update && apk upgrade && apk add --no-cache bash git openssh \
    && rm -rf /var/cache/apk/* \
    && cd /susy \
    && npm install \
    && npm run build \
    && npm run export

FROM nginx:stable-alpine as nginx
COPY --from=gravity /susy/dist /usr/share/nginx/html
RUN mkdir -p /etc/nginx/sites-enabled

# COPY ./nginx.conf /etc/nginx/
# COPY ./default.conf /etc/nginx/sites-enabled/default.conf
# RUN ls -la /usr/share/nginx/html
RUN chmod -R 0777 /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]