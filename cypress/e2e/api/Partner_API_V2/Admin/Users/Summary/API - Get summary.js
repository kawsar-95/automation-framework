import { users } from "../../../../../../../helpers/TestData/users/users"



describe("Summary Test", () => {
    it("GET - Get summary", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/summary", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)



        })
    })
})