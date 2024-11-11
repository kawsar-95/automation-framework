import { users } from "../../../../../../../helpers/TestData/users/users"




describe("Employment Details Test", () => {

it("PUT - Update employment details", () => {

    cy.fixture('postDataPartnerApi').then((data) => {
        const requestBody = data.bodyUpdateEmploymentDetails
        cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/employment-details", null, requestBody).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.supervisorId).to.exist


        })
    })
})
})