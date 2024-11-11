import { users } from "../../../../../../../helpers/TestData/users/users";



describe("External Identifiers Test", () => {

    it("POST - Create External Identifier", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyExternalIdentifiers1
            cy.postPartnerApiV2(requestBody, null, "/admin/users/" + users.learner01.learner01UserID + "/external-identifiers").then((response) => {
                expect(response.status).to.be.eq(409)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
})