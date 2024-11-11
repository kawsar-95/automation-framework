

let venueID;

describe("Venues Report Test", () => {
    it("GET - List Venues", () => {


        cy.getApiSFV2("/admin/reports/venues", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            venueID = response.body.venues[0].id


        })
    })
})