// Global support file for E2E tests

// Custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth/login')
  cy.get('input[type="email"]').clear().type(email)
  cy.get('input[type="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-btn"]').click()
  cy.url().should('include', '/auth/login')
})

Cypress.Commands.add('signup', (name, email, password) => {
  cy.visit('/auth/signup')
  cy.get('input[type="text"]').first().clear().type(name)
  cy.get('input[type="email"]').clear().type(email)
  cy.get('input[type="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
})

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('hydration') || err.message.includes('ResizeObserver')) {
    return false
  }
})
