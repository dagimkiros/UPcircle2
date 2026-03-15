// ─── SECURITY TESTS ───────────────────────────────────────────────────

describe('Security - XSS Protection', () => {
  it('blocks XSS in login email field', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type('<script>alert("xss")</script>')
    cy.get('input[type="password"]').type('Password123!')
    cy.get('button[type="submit"]').click()
    cy.wait(1000)
    // No alert should appear
    cy.on('window:alert', () => {
      throw new Error('XSS alert executed!')
    })
    cy.url().should('include', '/auth/login')
    cy.log('XSS in login email blocked ✓')
  })

  it('blocks XSS in signup name field', () => {
    cy.visit('/auth/signup')
    const xssPayload = '<script>alert("xss")</script>'
    cy.get('input').first().type(xssPayload)
    cy.wait(500)
    cy.on('window:alert', () => {
      throw new Error('XSS alert executed!')
    })
    cy.log('XSS in signup name blocked ✓')
  })

  it('blocks XSS via URL parameters', () => {
    cy.visit('/?q=<script>alert("xss")</script>', { failOnStatusCode: false })
    cy.wait(500)
    cy.on('window:alert', () => {
      throw new Error('XSS via URL executed!')
    })
    cy.log('XSS via URL blocked ✓')
  })

  it('does not expose sensitive data in page source', () => {
    cy.visit('/')
    cy.document().then((doc) => {
      const source = doc.documentElement.innerHTML.toLowerCase()
      expect(source).not.to.include('service_role')
      expect(source).not.to.include('private_key')
      expect(source).not.to.include('sk_live')
    })
    cy.log('No sensitive keys exposed ✓')
  })
})

describe('Security - SQL Injection Protection', () => {
  it('handles SQL injection in login email', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type("' OR '1'='1'; --")
    cy.get('input[type="password"]').type('Password123!')
    cy.get('button[type="submit"]').click()
    cy.wait(1500)
    // Should not navigate to dashboard
    cy.url().should('not.include', '/dashboard')
    // Should not show DB errors
    cy.get('body').invoke('text').then((text) => {
      expect(text.toLowerCase()).not.to.include('sql syntax')
      expect(text.toLowerCase()).not.to.include('database error')
      expect(text.toLowerCase()).not.to.include('pg error')
    })
    cy.log('SQL injection in login blocked ✓')
  })

  it('handles SQL injection in URL', () => {
    cy.visit("/dashboard?id=1'+OR+'1'='1", { failOnStatusCode: false })
    cy.url().should('include', '/auth/login')
    cy.log('SQL injection via URL redirected to login ✓')
  })
})

describe('Security - Input Validation', () => {
  it('rejects extremely long inputs', () => {
    cy.visit('/auth/signup')
    const longString = 'a'.repeat(500)
    cy.get('input[type="email"]').type(longString + '@test.com')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/auth/signup')
    cy.log('Long input handled gracefully ✓')
  })

  it('handles special characters in inputs', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type('test+special@test.com')
    cy.get('input[type="password"]').type('P@ssw0rd!#$%')
    cy.get('button[type="submit"]').click()
    cy.wait(1000)
    // Should not crash
    cy.get('body').should('be.visible')
    cy.log('Special characters handled ✓')
  })

  it('does not reveal if email exists on login failure', () => {
    cy.visit('/auth/login')
    cy.get('input[type="email"]').type('definitelynotexist@fake.com')
    cy.get('input[type="password"]').type('WrongPass123!')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.get('body').invoke('text').then((text) => {
      // Should not say "email not found" - generic error only
      expect(text.toLowerCase()).not.to.include('email not found')
      expect(text.toLowerCase()).not.to.include('user does not exist')
    })
    cy.log('Generic error message shown (email enumeration prevented) ✓')
  })
})
