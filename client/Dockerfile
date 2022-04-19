# Pin LTS Alpine image to a specific digest.
FROM node:lts-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d AS builder

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Set ownership of the files to the node user and group.
RUN chown -R node:node /usr/src/app

# Run as the node user.
USER node

# Install dependencies required to run the Remix production server.
RUN npm install && npm run build

#FROM node:lts-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d AS final

# run it on port 3000 (default)
EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["run", "start", "-w", "byway-ui"]
