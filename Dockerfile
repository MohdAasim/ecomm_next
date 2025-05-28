# Use official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose the default Next.js dev port
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev"]
