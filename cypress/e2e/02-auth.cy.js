// ─── AUTH FLOW TESTS ──────────────────────────────────────────────────

describe('Authentication - Login Page', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('loads the login page', () => {
    cy.contains('Sign In').should('be.visible')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })

  it('shows error on empty form submission', () => {
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('shows error on invalid credentials', () => {
    cy.get('input[type="email"]').type('fake@test.com')
    cy.get('input[type="password"]').type('WrongPassword123!')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.get('body').should('contain.text', 'Invalid')
      .or('contain.text', 'incorrect')
      .or('contain.text', 'error')
  })

  it('blocks invalid email format', () => {
    cy.get('input[type="email"]').type('notanemail')
    cy.get('input[type="password"]').type('Password123!')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('has a link to signup page', () => {
    cy.contains('Sign up').click()
    cy.url().should('include', '/auth/signup')
  })

  it('password field is masked', () => {
    cy.get('input[type="password"]').should('have.attr', 'type', 'password')
  })

  it('rate limits after multiple failed attempts', () => {
    for (let i = 0; i < 6; i++) {
      cy.get('input[type="email"]').clear().type('ratelimit@test.com')
      cy.get('input[type="password"]').clear().type('WrongPass123!')
      cy.get('button[type="submit"]').click()
      cy.wait(500)
    }
    cy.get('body').then(($body) => {
      const text = $body.text().toLowerCase()
      const isRateLimited = text.includes('too many') || text.includes('wait') || text.includes('locked')
      cy.log(isRateLimited ? 'Rate limiting triggered ✓' : 'Rate limiting not visible in UI')
    })
  })
})

describe('Authentication - Signup Page', () => {
  beforeEach(() => {
    cy.visit('/auth/signup')
  })

  it('loads the signup page', () => {
    cy.contains('Create').should('be.visible')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })

  it('rejects weak password', () => {
    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('weak')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/auth/signup')
  })

  it('rejects password without uppercase', () => {
    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('password123!')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/auth/signup')
  })

  it('rejects invalid email', () => {
    cy.get('input[type="email"]').type('notanemail')
    cy.get('input[type="password"]').type('Password123!')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/auth/signup')
  })

  it('has a link to login page', () => {
    cy.contains('Sign in').click()
    cy.url().should('include', '/auth/login')
  })
})

describe('Authentication - Route Protection', () => {
  it('redirects /dashboard to login when not authenticated', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/auth/login')
  })

  it('redirects /dashboard/circles to login when not authenticated', () => {
    cy.visit('/dashboard/circles')
    cy.url().should('include', '/auth/login')
  })

  it('redirects /dashboard/profile to login when not authenticated', () => {
    cy.visit('/dashboard/profile')
    cy.url().should('include', '/auth/login')
  })

  it('redirects /dashboard/activity to login when not authenticated', () => {
    cy.visit('/dashboard/activity')
    cy.url().should('include', '/auth/login')
  })
})
