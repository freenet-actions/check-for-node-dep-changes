FROM node:slim

LABEL "com.github.actions.name"="Node Dependency Change Detector"
LABEL "com.github.actions.description"="Detects change to dependencies in package.json"
LABEL "com.github.actions.icon"="archive"
# I like purple
LABEL "com.github.actions.color"="purple" 

COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]
