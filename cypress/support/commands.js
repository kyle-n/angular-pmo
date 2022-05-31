// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add("showRestaurantsFrom", (state, city) => {
  cy.get("[data-test=pmo-home__button--choose").click();
  cy.get("[data-test=pmo-restaurant__select--state]").select([state]);
  cy.get("[data-test=pmo-restaurant__select--city]").select([city]);
});
