FROM node:18
RUN apt-get update
WORKDIR /email-app
COPY package.json /email-app
RUN npm install
COPY . /email-app
CMD ["npm", "run", "email-app-prod"]
EXPOSE 7011
