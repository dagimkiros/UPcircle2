const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // E2E Testing
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    env: {
      TEST_EMAIL: 'test_cypress@mailinator.com',
      TEST_PASSWORD: 'CypressTest123!',
      TEST_NAME: 'Cypress Tester',
      PROD_URL: 'https://upcircle2.vercel.app',
    },
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
    },
  },

  // Component Testing
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.js',
    supportFile: 'cypress/support/component.js',
  },
})
