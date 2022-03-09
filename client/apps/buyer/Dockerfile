# Pin LTS Alpine image to a specific digest.
FROM node:lts-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /usr/src/app

# run it on port 3000 (default)
EXPOSE 3000 8002

# Run as the node user.
USER node

CMD ["npm", "start"]
