FROM node:18
RUN apt-get update
WORKDIR /user-app
COPY package.json /user-app
RUN npm install
COPY . /user-app
RUN mkdir -p /user-app/uploads
CMD ["npm", "run", "user-app-prod"]
EXPOSE 7001
