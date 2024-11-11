const { defineConfig } = require('cypress')
const { configureAllureAdapterPlugins } = require('@mmisty/cypress-allure-adapter/plugins');

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/result-[hash].xml',
  },
  experimentalStudio: true,
  defaultCommandTimeout: 30000,
  requestTimeout: 20000,
  retries: {
    runMode: 1,
    openMode: 1,
  },
  video: false,
  'X-Absorb-API-Key': '',
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    // can use allure env var here or from cmd line by
    // `npx cypress run --env allure=true` or `CYPRESS_allure=true npx cypress run`
    allure: true,
    allureCleanResults: true,
    // allureSkipCommands: 'wrap',
    // allureResults: './allure-results'
  },
  e2e: {
    setupNodeEvents(on, config) {
      const reporter = configureAllureAdapterPlugins(on, config);
      // this is to write categories and environment information
      on('before:run', details => {
        reporter?.writeEnvironmentInfo({
          info: {
            cypressVersion: details.cypressVersion,
            os: details.system.osName,
            osVersion: details.system.osVersion,
            browser: details.browser?.displayName + ' ' + details.browser?.version,
            nodeJsVersion: details.config.resolvedNodeVersion,
            ...details.config.env
          },
        });
        reporter?.writeCategoriesDefinitions({ categories: './allure-error-categories.json' });
      });

      const path = require("path");
      const fs = require("fs-extra");
      function getConfigurationByFile(file) {
        const pathToConfigFile = path.resolve("cypress/config", `${file}.json`);
        if (!fs.existsSync(pathToConfigFile)) {
          console.log('Custom config file not found, default configuration file is being used')
          return getConfigurationByFile('qamain');
        }
        console.log(`Loading custom config file: ${pathToConfigFile}`)
        return fs.readJson(pathToConfigFile);
      }
      const file = config.env.configFile || 'qamain';
      return getConfigurationByFile(file).then((loadedConfig) => {
        let mergedConfig = {
          ...config,
          ...loadedConfig,
        };
        return mergedConfig;
      });
    },
    baseUrl: 'https://guiaar.qa2.myabsorb.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx,spec}',
  }
})
