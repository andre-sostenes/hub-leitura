/// <reference types="cypress" />

describe('App Actions - Hub de Leitura', () => {

  beforeEach(() => {
    cy.setCookie('jwt_education_shown', 'true')
  })

  it('Deve fazer login com sucesso com usuário comum - usando app actions', () => {
    cy.loginApp(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
    cy.get('h4').should('contain', 'Olá')
  })

  it('Deve fazer login com sucesso com usuário comum - via api', () => {
    cy.request({
      method: 'POST',
      url: 'api/login',
      body: {
        email: Cypress.env('USER_EMAIL'),
        password: Cypress.env('USER_SENHA')
      }
    }).then((response) => {
      expect(response.status).to.equal(200)

      window.localStorage.setItem('authToken', response.body.token)
      window.localStorage.setItem('isAdmin', response.body.isAdmin ?? false)
      window.localStorage.setItem('userId', response.body.id ?? 1)
      window.localStorage.setItem('userName', response.body.name)

      cy.visit('dashboard.html')
      cy.get('h4').should('contain', 'Olá')
    })
  })

  it('Deve fazer login com sucesso com usuário admin - via api com token', () => {
    cy.request({
      method: 'POST',
      url: 'api/login',
      body: {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_SENHA')
      }
    }).then((response) => {
      expect(response.status).to.equal(200)

      window.localStorage.setItem('authToken', response.body.token)
      window.localStorage.setItem('isAdmin', response.body.isAdmin ?? true)
      window.localStorage.setItem('userId', response.body.id ?? 1)
      window.localStorage.setItem('userName', response.body.name)

      cy.visit('dashboard.html')
      cy.get('h4').should('contain', 'Admin')
    })
  })

})