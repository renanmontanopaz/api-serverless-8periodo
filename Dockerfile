# Use the official Node.js image as the base image
FROM node:22

## Set the working directory inside the container
#WORKDIR /usr/src/app
#
## Copy package.json and package-lock.json to the working directory
#COPY package*.json ./
#
## Install the application dependencies
#RUN npm install
#
## Copy the rest of the application files
#COPY . .
#
## Build the NestJS application
#RUN npx prisma migrate dev && npm run build
#
## Expose the application port
#EXPOSE 3000
#
## Command to run the application
#CMD ["node", "dist/src/main.js"]

# For Mac M1+, use the following line instead of the next line
# FROM --platform=linux/amd64 public.ecr.aws/lambda/nodejs:20
FROM public.ecr.aws/lambda/nodejs:22

# Copy compiled code to the image
COPY dist ./

# Run the handler function
CMD ["main.handler"]