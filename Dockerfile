FROM node:21-alpine3.18
COPY . /usr/local/app
WORKDIR /usr/local/app
CMD ["node", "."]
