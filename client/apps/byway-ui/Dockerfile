# Pin LTS Alpine image to a specific digest.
FROM node:lts-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d

# Create app directory
WORKDIR /usr/src/app


# Copy Remix build files to the app directory.
COPY build build
COPY public public

# Copy the package.json used for deployment vs the dev/build environment.
COPY package-docker.json package.json

# Install dependencies required to run the Remix production server.
RUN npm install

# Set ownership of the files to the node user and group.
RUN chown -R node:node /usr/src/app

# run it on port 3000 (default)
EXPOSE 3000

# Run as the node user.
USER node

CMD ["npm", "start"]
