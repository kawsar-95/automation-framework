


let queryParams = {
    key: ''
}

describe("API - Users Test", () => {

    it("POST - Creates and/or updates Users from a List of Users.", () => {
      
            cy.postApiV15(null, queryParams, "/users/upload").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(1000)
                expect(response.body.Message).to.equal("Request requires at least 1 User. Please adjust your UPSERT call.")
            })
        })
    })

