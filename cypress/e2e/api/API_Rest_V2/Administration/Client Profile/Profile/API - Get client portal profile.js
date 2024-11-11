import { users } from "../../../../../../../helpers/TestData/users/users";





describe("Client Profile Test", () => {
    it("GET - Client Profile", () => {

        cy.getApiV2("/api/rest/v2/admin/my-client-profile", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(Cypress.env('client_ID'))


        })
    })
})
