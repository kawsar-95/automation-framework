import { users } from "../../../../../../../helpers/TestData/users/users"



describe("Management Permission Test", () => {
    it("GET - Get user management settings", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/user-management-settings", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.userTypes[0]).to.equal("Learner")


        })
    })
})