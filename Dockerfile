FROM cypress/base:latest

WORKDIR /home/hub

COPY package.json package-lock.json ./
RUN npm ci

COPY cypress.config.js cypress.env.json ./
COPY cypress ./cypress

CMD ["npm", "test"]