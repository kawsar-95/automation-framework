


describe("API - Venues Test", () => {

    it("PUT - Update Venue.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyVenues1
            cy.putApiV15(requestBody, "/venues/50d11b5e-4305-4141-9d5b-780f44573922").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(2500)


            })
        })
    })
})
