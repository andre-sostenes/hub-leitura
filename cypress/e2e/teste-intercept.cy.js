/// <reference types="cypress" />

describe('Intercept - Hub de Leitura', () => {

  beforeEach(() => {
    cy.visit('login.html')
    cy.setCookie('jwt_education_shown', 'true')
  })

  it('Deve fazer login com sucesso com usuário comum - usando intercept', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 200,
      body: {
        token: 'token123',
        name: 'Usuário de teste'
      }
    }).as('loginMock')

    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
    cy.wait('@loginMock').its('response.statusCode').should('eq', 200)
    cy.get('h4').should('contain', 'Olá')
  })

  it('Deve simular um erro do servidor - usando intercept', () => {
    cy.intercept('POST', 'api/login', { statusCode: 500 }).as('erroServer')

    cy.loginErro(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
    cy.wait('@erroServer').its('response.statusCode').should('eq', 500)
    cy.get('#alert-container').should('contain', 'Erro de conexão. Tente novamente.')
  })

  it('Deve simular um erro do cliente - usando intercept', () => {
    cy.intercept('POST', 'api/login', {
      statusCode: 400,
      body: { erro: 'Erro ao fazer login' }
    }).as('erroClient')

    cy.loginErro(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))
    cy.wait('@erroClient').its('response.statusCode').should('eq', 400)
    cy.get('#alert-container').should('contain', 'Erro ao fazer login')
  })

  it('Deve exibir as reservas via intercept', () => {
    cy.loginApp(Cypress.env('USER_EMAIL'), Cypress.env('USER_SENHA'))

    cy.fixture('reservas').then((dadosReserva) => {
      cy.intercept('GET', 'api/reservations', {
        statusCode: 200,
        body: dadosReserva
      }).as('listarReservas')

      cy.visit('dashboard.html')
      cy.wait('@listarReservas')
      cy.contains('Novo livro fixture').should('be.visible')
    })
  })

})