import { users } from "../../../../../../../helpers/TestData/users/users"



describe("Roles Test", () => {
    it("GET - Get user roles", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/roles", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.roles[0].name).to.equal("Instructor")



        })
    })
})