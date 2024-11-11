import { users } from "../../../../../../../helpers/TestData/users/users"


describe("Details Test", () => {

it("PUT - Update user details", () => {

    cy.fixture('postDataPartnerApi').then((data) => {
        const requestBody = data.bodyUpdateUserDetails
        cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/details", null, requestBody).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.notes).to.exist
            expect(response.body.notes).to.equal("No joy in mud vile mighty Cassy has struck out")


        })
    })
})
})
