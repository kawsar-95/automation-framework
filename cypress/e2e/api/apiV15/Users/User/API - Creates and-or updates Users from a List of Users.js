import { users } from "../../../../../../helpers/TestData/users/users";


let queryParams = {
    key: ''
}

describe("API - Users Test", () => {

    it("POST - Creates and/or updates Users from a List of Users.", () => {
      
            cy.postApiV15(null, queryParams, "/users/upload").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(1000)
                expect(response.body.message).to.equal("Invalid format provided for key")
            })
        })
    })

