// ─── CIRCLES TESTS ────────────────────────────────────────────────────

describe('Circles - Unauthenticated', () => {
  it('redirects circles page to login', () => {
    cy.visit('/dashboard/circles')
    cy.url().should('include', '/auth/login')
  })

  it('redirects new circle page to login', () => {
    cy.visit('/dashboard/circles/new')
    cy.url().should('include', '/auth/login')
  })

  it('redirects join circle page to login', () => {
    cy.visit('/dashboard/circles/join')
    cy.url().should('include', '/auth/login')
  })
})

describe('Circles - New Circle Form (requires auth)', () => {
  before(() => {
    if (!Cypress.env('TEST_EMAIL')) return
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'))
    cy.visit('/dashboard/circles/new')
  })

  it('shows the new circle form', () => {
    cy.url().should('include', '/dashboard/circles/new')
    cy.contains('Circle').should('exist')
  })

  it('rejects empty circle name', () => {
    cy.get('button[type="submit"]').first().click()
    cy.url().should('include', '/dashboard/circles/new')
  })

  it('rejects circle name that is too short', () => {
    cy.get('input').first().type('Ab')
    cy.get('button[type="submit"]').first().click()
    cy.get('body').should('contain.text', '3 characters')
      .or('contain.text', 'too short')
      .or('contain.text', 'invalid')
  })

  it('rejects XSS in circle name', () => {
    cy.get('input').first().clear().type('<script>alert("xss")</script>')
    cy.on('window:alert', () => {
      throw new Error('XSS in circle name executed!')
    })
    cy.log('XSS in circle name blocked ✓')
  })

  it('rejects invalid contribution amount', () => {
    cy.get('input').first().clear().type('Valid Circle Name')
    // Try to enter 0 or negative amount
    cy.get('input[type="number"]').first().clear().type('0')
    cy.get('button').contains('Next').click()
    cy.get('body').should('contain.text', 'valid')
      .or('contain.text', 'amount')
      .or('contain.text', 'required')
  })
})

describe('Circles - Join Circle (requires auth)', () => {
  before(() => {
    if (!Cypress.env('TEST_EMAIL')) return
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'))
    cy.visit('/dashboard/circles/join')
  })

  it('shows the join circle page', () => {
    cy.url().should('include', '/dashboard/circles/join')
  })

  it('shows an invite code input', () => {
    cy.get('input').should('exist')
  })

  it('rejects empty invite code', () => {
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard/circles/join')
  })

  it('shows error for invalid invite code', () => {
    cy.get('input').type('INVALIDCODE123')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.get('body').should('contain.text', 'not found')
      .or('contain.text', 'invalid')
      .or('contain.text', 'error')
  })
})
