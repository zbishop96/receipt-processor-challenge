# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Expose the port your NestJS app runs on (default is 3000)
EXPOSE 3000

# Define the command to start the app
CMD ["npm", "run", "start:prod"]
