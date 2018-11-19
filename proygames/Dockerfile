# First get latest node docker and copy the project.
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# After that use nxinx to run the project
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=node /app/build /usr/share/nginx/html

#FROM node:8
#WORKDIR /usr/src/app
#RUN npm install
#COPY . .
#EXPOSE 3000
#CMD ["npm", "start"]