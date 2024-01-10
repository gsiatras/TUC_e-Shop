# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /TUC_e-Shop/Frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that Next.js will run on
EXPOSE 3002


# Start the Next.js app
CMD ["npm", "run", "dev"]
