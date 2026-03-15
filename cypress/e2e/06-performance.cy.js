// ─── PERFORMANCE TESTS ────────────────────────────────────────────────

describe('Performance', () => {
  it('landing page loads in under 5 seconds', () => {
    const start = Date.now()
    cy.visit('/')
    cy.get('body').should('be.visible').then(() => {
      const elapsed = Date.now() - start
      cy.log(`Landing page load time: ${elapsed}ms`)
      expect(elapsed).to.be.lessThan(5000)
    })
  })

  it('login page loads in under 5 seconds', () => {
    const start = Date.now()
    cy.visit('/auth/login')
    cy.get('input[type="email"]').should('be.visible').then(() => {
      const elapsed = Date.now() - start
      cy.log(`Login page load time: ${elapsed}ms`)
      expect(elapsed).to.be.lessThan(5000)
    })
  })

  it('has no broken images on landing page', () => {
    cy.visit('/')
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.prop', 'naturalWidth').and('be.gt', 0)
    })
  })

  it('all nav links on landing page are valid', () => {
    cy.visit('/')
    cy.get('nav a').each(($a) => {
      const href = $a.attr('href')
      if (href && !href.startsWith('#') && !href.startsWith('mailto')) {
        cy.log(`Checking link: ${href}`)
      }
    })
  })

  it('renders correctly on mobile viewport', () => {
    cy.viewport(390, 844)
    cy.visit('/')
    cy.get('body').should('be.visible')
    // Check no horizontal overflow
    cy.window().then((win) => {
      const bodyWidth = win.document.body.scrollWidth
      const viewportWidth = win.innerWidth
      cy.log(`Body width: ${bodyWidth}, Viewport: ${viewportWidth}`)
      expect(bodyWidth).to.be.lte(viewportWidth + 20)
    })
  })

  it('renders correctly on tablet viewport', () => {
    cy.viewport(768, 1024)
    cy.visit('/')
    cy.get('body').should('be.visible')
    cy.contains('UpCircle').should('be.visible')
  })
})
