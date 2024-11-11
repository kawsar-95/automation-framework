
import users from '../../../fixtures/users.json'
let authToken;

describe('API - Basic Billboard Tests', () => {

    before(() => {
        cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
            authToken = response.body.token
        });
      })

    it('GET a specific Billboard', () => {
            cy.request({
                method: "GET",
                url: "/api/rest/v2/admin/billboards/2a567096-8502-42fd-bca2-067fa17eed81",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                }
            }).then((response) => {
                expect(response.body).to.not.eq(null)
            })
    })
})