# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages
RUN npm i

RUN npm install nodemon -g

# Copy the rest of the application code into the working directory
COPY . .

# Expose port 3000 to the host machine
EXPOSE 5200

# Start the application
CMD ["npm", "start"]
