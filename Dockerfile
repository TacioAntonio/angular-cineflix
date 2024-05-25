FROM node:latest as angular-cineflix
WORKDIR /angular-cineflix
COPY package*.json /angular-cineflix
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular-cineflix /angular-cineflix/dist/angular-cineflix/browser /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
