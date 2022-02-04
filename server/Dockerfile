#
# This Dockerfile creates a docker image for the pico engine with an external mount point for the image
#
# To build:
#    docker build -t <username>/<container-name> github.com/picolab/pico-engine
#
# For example:
#    docker build -t pjw/pico-engine github.com/picolab/pico-engine
#
# To run:
#    docker run -p <port>:3000  -v <mount-point>:/var/pico-image -d <username>/container-name>
#
# For example:
#    docker run -p 3001:3000  -v ~/images/pico-image:/var/pico-image -d pjw/pico-engine
#
# runs the docker with a port of 3001 and the image files located at ~/tmp/pico-image on the local machine.
#
# If you need to set the URL for your engine, you can add the PICO_ENGINE_BASE_URL env variable:
#
#    docker run -p 443:3000  -v ~/images/pico-image:/var/pico-image -d pjw/pico-engine -e PICO_ENGINE_BASE_URL=https://picos.picolabs.io
#
# You can run the same container multiple times with different ports and mount points to have multiple engines
# running at the same time.
#

# Dockerfile modified to follow https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

# Pin LTS Alpine image to a specific digest.
FROM node:lts-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d

# Create app directory
WORKDIR /usr/src/app

ENV PICO_ENGINE_HOME=/var/pico-image

# Global install in a non-root location.
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Create mount point for image and set permissions.
RUN mkdir /var/pico-image && chown -R node:node /var/pico-image
VOLUME ["/var/pico-image"]

# install the production pico-engine 
RUN npm install -g pico-engine

# run it on port 3000 (default)
EXPOSE 3000

# Run pico engine as the node user.
USER node

CMD ["pico-engine"]

# This might be useful for creating a docker image of the dev env (includes parser, etc.)
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install

# # Bundle app source
# COPY . .

# EXPOSE 3000
# RUN npm run clean-setup
# CMD [ "npm", "start" ]

