import { users } from "../../../../../../../helpers/TestData/users/users"



describe("Profile Test", () => {
    it("GET - Get Profile", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/profile", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.username).to.equal("Learner01")



        })
    })
})