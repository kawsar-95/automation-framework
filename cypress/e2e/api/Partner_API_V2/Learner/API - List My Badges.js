describe("My Badges Test", () => {

    let badgeID;
    let queryParams = {
        _limit: "20",
        _offset: "0"
    }
    it("GET - List My Badges", () => {
        cy.getApiSFV2("/my-badges", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            badgeID = response.body._embedded.badges[0].id

        })
    })

    it("GET - My Badge", () => {
        cy.getApiSFV2("/my-badges/" + badgeID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(badgeID)
        })
    })

})