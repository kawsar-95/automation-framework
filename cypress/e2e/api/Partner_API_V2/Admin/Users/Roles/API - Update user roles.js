import { users } from "../../../../../../../helpers/TestData/users/users";




describe("Roles Test", () => {

    it("PUT - Update user roles", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyUserRoles
            cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/roles", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)
                expect(response.body.roles[0].name).to.equal("Instructor")


            })
        })
    })
})