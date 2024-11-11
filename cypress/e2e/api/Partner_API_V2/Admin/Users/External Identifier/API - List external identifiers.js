import { users } from "../../../../../../../helpers/TestData/users/users";



describe("External Identifiers Test", () => {
    it("GET - List External Identifiers", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/external-identifiers", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})