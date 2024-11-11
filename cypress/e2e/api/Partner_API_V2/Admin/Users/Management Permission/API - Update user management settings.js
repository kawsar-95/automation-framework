import { users } from "../../../../../../../helpers/TestData/users/users";




describe("User Management Test", () => {

    it("PUT - Update User Management settings", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyUserManagement
            cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID  + "/user-management-settings", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)
                expect(response.body.userTypes[0
                ]).to.equal("Learner")


            })
        })
    })
})