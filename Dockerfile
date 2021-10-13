FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm run test
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run deploy:build

EXPOSE 3060
CMD [ "node", "app.js" ]
#CMD ["npm", "run", "pm2:start"]