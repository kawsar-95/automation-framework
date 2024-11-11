import { users } from "../../../../../../../helpers/TestData/users/users";



describe("Contact Information Test", () => {
    it("PUT - Update user contact information.", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyUpdateUser
            cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/contact-information", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
})

