



describe("Logging Test", () => {

    it("POST - Create a set of logs", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyCreateLog
            cy.postPartnerApiV2(requestBody, null, "/admin/log-requests").then((response) => {
                expect(response.status).to.be.eq(201)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
})