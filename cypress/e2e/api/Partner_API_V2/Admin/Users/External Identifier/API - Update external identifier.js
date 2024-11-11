




describe("External Identifiers Test", () => {

    it("PUT - Update an external identifier", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyExternalIdentifiers3
            cy.putApiPartnerV2("/admin/departments/id/external-identifiers", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(3000)
                expect(response.body.validations["0"][0].message).to.include("The value 'id' is not valid for Guid.")


            })
        })
    })
})