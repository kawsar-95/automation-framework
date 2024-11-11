




describe("Certificates Test", () => {

    let certificateID;
    let queryParams = {
        _limit: "20",
        _offset: "0"
    }
    it("GET - List my certificates", () => {
        cy.getApiSFV2("/my-certificates", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            certificateID = response.body._embedded.certificates[0].id
        })
    })

    it("GET - my certificate", () => {
        cy.getApiSFV2("/my-certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(certificateID)

        })
    })

    it("GET - my certificate PDF", () => {
        cy.getApiSFV2("/my-certificates/" + certificateID + "/pdf", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)

        })
    })


})