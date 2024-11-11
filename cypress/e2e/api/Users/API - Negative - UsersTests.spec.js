import users from "../../../fixtures/users.json";
let authToken;

describe("API - Basic Users Tests", () => {
    before(() => {
        cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
            authToken = response.body.token;
        })
    })
})

describe("API - Negative Users Tests - A", () => {
    it("GET - All Users", () => {
        cy.request({
            method: "GET",
            url: "/api/rest/v2/admin/user",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "X-Absorb-API-Key": Cypress.env('api_Key'),
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.eq(404)
            expect(response.body.Message).to.be.eq('No HTTP resource was found that matches the request URI')
        });
    });
})