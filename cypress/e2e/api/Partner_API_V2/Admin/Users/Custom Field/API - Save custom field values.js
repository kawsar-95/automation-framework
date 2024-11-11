import { users } from "../../../../../../../helpers/TestData/users/users";



describe("Custom Fields Test", () => {
    it("PUT - Save custom field values", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyCustomFields
            cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/custom-fields", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
})
