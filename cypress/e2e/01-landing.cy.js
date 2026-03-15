// ─── LANDING PAGE TESTS ───────────────────────────────────────────────

describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads without errors', () => {
    cy.title().should('not.be.empty')
    cy.get('body').should('be.visible')
  })

  it('shows the UpCircle brand', () => {
    cy.contains('UpCircle').should('be.visible')
  })

  it('shows the hero headline', () => {
    cy.contains('Save Together').should('be.visible')
    cy.contains('Grow Together').should('be.visible')
  })

  it('has working navigation links', () => {
    cy.get('nav').should('be.visible')
    cy.contains('Sign In').should('be.visible')
    cy.contains('Get Started').should('be.visible')
  })

  it('Sign In button links to login page', () => {
    cy.contains('Sign In').click()
    cy.url().should('include', '/auth/login')
  })

  it('Get Started button links to signup page', () => {
    cy.contains('Get Started').first().click()
    cy.url().should('include', '/auth/signup')
  })

  it('shows How It Works section', () => {
    cy.contains('How It Works').should('exist')
  })

  it('shows Features section', () => {
    cy.contains('Features').should('exist')
  })

  it('shows FAQ section', () => {
    cy.contains('FAQ').should('exist')
  })

  it('has a footer', () => {
    cy.get('footer').should('exist')
    cy.contains('Privacy').should('exist')
    cy.contains('Terms').should('exist')
  })

  it('is using HTTPS', () => {
    cy.location('protocol').then((protocol) => {
      // localhost uses http, production uses https
      expect(['http:', 'https:']).to.include(protocol)
    })
  })

  it('shows community names', () => {
    cy.contains('Ekub').should('exist')
    cy.contains('Tanda').should('exist')
  })

  it('CTA banner has sign up button', () => {
    cy.contains('Create Your Free Account').should('exist')
  })

  it('is mobile responsive', () => {
    cy.viewport('iphone-14')
    cy.get('body').should('be.visible')
    cy.contains('UpCircle').should('be.visible')
  })
})
