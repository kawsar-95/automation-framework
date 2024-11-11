


let venueID;

describe("API -  Venues Test", () => {
    it("GET - List Venues.", () => {
        cy.getApiV15("/venues", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            venueID = response.body[1].Id
        })
    })

    it("GET - Get Venue.", () => {
        cy.getApiV15("/venues/" + venueID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.equal(venueID)
        })
    })
})