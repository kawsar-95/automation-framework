import { users } from "../../../../../../helpers/TestData/users/users";


let queryParams = {
    key: ''
}

describe("API - Users Test", () => {

    it("POST - Upsert user if the username or external ID matches.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyUpdateUser
            cy.postApiV15(requestBody, queryParams, "/createabsorbaccount").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(1000)
                expect(response.body.message).to.equal("Invalid format provided for key")
            })
        })
    })
})