


describe("API - Venues Test", () => {

    it("POST - Create venue.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyVenues1
            cy.postApiV15(requestBody, null , "/venues").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(1000)
                expect(response.body["venueViewModel.Name"]._errors[0]["<ErrorMessage>k__BackingField"]).to.equal("The Name field is required.")
            })
        })
    })
})
