# Use the official Node.js 16.x LTS image as the base image
FROM cypress/browsers:node-16.18.1-chrome-110.0.5481.96-1-ff-109.0-edge-110.0.1587.41-1

# Install required packages
RUN apt-get update && \
    apt-get install -y xvfb libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY cypress.config.js /app/
# Install dependencies
RUN npm install
RUN apt-get update && apt-get install -y google-chrome-stable
# Clear the Cypress cache and reinstall Cypress
 #RUN $(npm bin)/cypress cache clear
 #RUN npm install cypress@12.17.2
 
 # Run the Cypress binary installation command
RUN npm run cypress:verify
# Set the environment variable to run Cypress headlessly
ENV CI=1

# Expose the default Cypress port for the dashboard
EXPOSE 3000

# Run the tests
CMD ["npm", "run", "cypress:smokeLE:firefox"]
