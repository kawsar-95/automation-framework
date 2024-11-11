



describe("SMTP Health Check Test", () => {

    it("POST - Create SMTP Health Check Test", () => {

        cy.fixture('postDataRestV2').then((data) => {
            const requestBody = data.bodySMTPHealthCheck
            cy.postApiV2(requestBody, null, "/api/rest/v2/admin/smtp-health-check").then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
})