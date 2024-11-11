import { users } from "../../../../../../helpers/TestData/users/users";




describe("API - Users Test", () => {

    it("PUT - Update user management settings.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyUpdateUserManagement
            cy.putApiV15(requestBody, "/users/" + users.learner01.learner01UserID + "/user-management-settings").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(2500)
                expect(response.body.message).to.equal("Updating of user management settings for a non-admin user is not supported")

            })
        })
    })
})
