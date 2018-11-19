FROM node:latest
# Create app directory
WORKDIR /app
RUN npm install nodemon -g
# Install app dependencies
#COPY package.json ./
COPY . .
RUN npm install
# If you are building your code for production
#RUN npm install --only=production
# Bundle app source  
COPY . .
EXPOSE 3001
CMD node Index.js

#FROM node:8
#WORKDIR /usr/src/app
#RUN npm install
#COPY . .
#EXPOSE 9090
#CMD [ "node", "index.js" ]