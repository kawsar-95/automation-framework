import { users } from "../../../../../../helpers/TestData/users/users";




describe("API - Users Test", () => {

    it("PUT - Update user.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyUpdateUser
            cy.putApiV15(requestBody, "/users/20000000-0000-0000-0000-000000000002").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(2500)
                expect(response.body.Message).to.equal("The request is invalid.")


            })
        })
    })
})
