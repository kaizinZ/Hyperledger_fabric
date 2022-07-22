FROM node:14-buster-slim

ENV TZ Asia/Tokyo

WORKDIR /backend
COPY backend/package.json backend/ormconfig.js backend/docker-entrypoint.sh ./
COPY backend/dist ./dist
COPY backend/build ./build

ENTRYPOINT [ "/backend/docker-entrypoint.sh" ]
