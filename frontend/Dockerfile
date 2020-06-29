FROM node:14.2.0 as builder

RUN mkdir /src
WORKDIR /src

COPY ./package.json /src/
COPY ./package-lock.json /src/
COPY ./tsconfig.json /src/
COPY ./.env /src/
RUN npm install

COPY ./public/ /src/public/
COPY ./src/ /src/src/
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /src/build/ /usr/share/nginx/html
COPY ./nginx-default.conf /etc/nginx/nginx.conf
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
