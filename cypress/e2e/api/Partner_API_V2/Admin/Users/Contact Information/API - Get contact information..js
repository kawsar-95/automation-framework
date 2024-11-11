import { users } from "../../../../../../../helpers/TestData/users/users"



describe("Contact Information Test", () => {
    it("GET - Get contact information.", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/contact-information", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body).to.have.property("phoneNumber")
            expect(response.body).to.have.property("address1")


        })
    })
})