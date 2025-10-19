ARG NODE_VERSION=24.2.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=development

WORKDIR /app

COPY package.json package-lock.json ./
# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm install   # installs devDependencies too

COPY . .

EXPOSE 3000



CMD ["npm", "run", "dev"]
