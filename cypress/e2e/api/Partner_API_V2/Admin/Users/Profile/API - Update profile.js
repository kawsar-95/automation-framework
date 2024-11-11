import { users } from "../../../../../../../helpers/TestData/users/users";




describe("Profile Test", () => {

    it("PUT - Update Profile", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyUpdateProfile
            cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/profile", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)
                expect(response.body.username).to.equal("Learner01")


            })
        })
    })
})