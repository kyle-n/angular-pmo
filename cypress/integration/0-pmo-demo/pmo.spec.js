/// <reference types="cypress" />
describe("example pmo-app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:4200/");
  });

  it("should have 3 menu options in the header", () => {
    cy.get("[data-test=pmo-header] li").should("have.length", 3);
    cy.get("[data-test=pmo-header] li").first().should("have.text", "Home");
    cy.get("[data-test=pmo-header] li")
      .last()
      .should("have.text", "Order History");
  });

  it("should display restaurants in the city of Detroit", () => {
    cy.get("[data-test=pmo-home__button--choose").click();
    cy.get("[data-test=pmo-restaurant__select--state]").select(["Michigan"]);
    cy.get("[data-test=pmo-restaurant__select--city]").select(["Detroit"]);

    cy.get("[data-test=pmo-restaurant__list]")
      .should("have.length", 2)
      .find("h3")
      .first()
      .should("have.text", "Crab Barn");
  });

  it("should choose Crab Barn restaurant and place a order", () => {
    cy.showRestaurantsFrom("Michigan", "Detroit");

    cy.get("[data-test=pmo-restaurant__list]")
      .first()
      .find("[data-test=pmo-restaurant__button--details]")
      .click();
  });

  it("fetches list of states items - GET", () => {
    cy.request("/api/states").as("statesRequest");
    cy.get("@statesRequest").then((states) => {
      expect(states.status).to.eq(200);
      assert.isArray(states.body.data, "States Response is an array");
      expect(states.body.data).to.have.length(3);
    });
  });
});
