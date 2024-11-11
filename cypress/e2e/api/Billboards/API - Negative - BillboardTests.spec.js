
import users from '../../../fixtures/users.json'
let authToken;

describe('API - Negative Billboard Tests', () => {

    before(() => {
        cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
            authToken = response.body.token
        });
      })

    it('GET a specific Billboard', () => {
            cy.request({
                method: "GET",
                url: "/api/rest/v2/admin/billboards/9033f86c-56fc-4347-97f7-b952c2194f8",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key":  Cypress.env('api_Key'),
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.body.Message).to.be.eq('The request is invalid.')
            })
    })
})