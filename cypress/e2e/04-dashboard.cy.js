// ─── DASHBOARD TESTS ──────────────────────────────────────────────────
// Note: These tests require a logged-in session
// Set TEST_EMAIL and TEST_PASSWORD in cypress.config.js env

describe('Dashboard - Unauthenticated', () => {
  it('redirects to login when not authenticated', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/auth/login')
  })
})

describe('Dashboard - Layout (requires auth)', () => {
  before(() => {
    // Skip if no test credentials
    if (!Cypress.env('TEST_EMAIL')) {
      cy.log('No test credentials — skipping dashboard tests')
      return
    }
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'))
  })

  it('shows the dashboard after login', () => {
    cy.url().should('include', '/dashboard')
  })

  it('shows the sidebar with navigation', () => {
    cy.contains('My Circles').should('exist')
    cy.contains('Activity').should('exist')
    cy.contains('Profile').should('exist')
  })

  it('shows the greeting with user name', () => {
    cy.contains('Good').should('be.visible')
  })

  it('shows stat cards', () => {
    cy.contains('TRUST SCORE').should('exist')
    cy.contains('CIRCLES JOINED').should('exist')
  })

  it('shows New Circle button', () => {
    cy.contains('New Circle').should('be.visible')
  })

  it('shows Join Circle button', () => {
    cy.contains('Join Circle').should('be.visible')
  })

  it('shows Trust Score card', () => {
    cy.contains('YOUR TRUST SCORE').should('exist')
  })

  it('navigates to My Circles page', () => {
    cy.contains('My Circles').first().click()
    cy.url().should('include', '/dashboard/circles')
  })

  it('navigates to Activity page', () => {
    cy.visit('/dashboard')
    cy.contains('Activity').first().click()
    cy.url().should('include', '/dashboard/activity')
  })

  it('navigates to Profile page', () => {
    cy.visit('/dashboard')
    cy.contains('Profile').first().click()
    cy.url().should('include', '/dashboard/profile')
  })

  it('is mobile responsive', () => {
    cy.viewport('iphone-14')
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })
})
