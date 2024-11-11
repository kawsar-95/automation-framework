import { users } from "../../../../../../../helpers/TestData/users/users";





describe("Client Profile Test", () => {
    it("GET - Get the WalkMe integration script.", () => {

        cy.getApiV2("/api/rest/v2/admin/my-client-profile/walk-me-integration-script", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body).to.have.property("integrationScriptSrc")


        })
    })
})
