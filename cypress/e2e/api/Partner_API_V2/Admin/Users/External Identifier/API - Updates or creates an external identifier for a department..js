




describe("External Identifiers Test", () => {

    it("PUT - Updates or creates an external identifier for a department.", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyExternalIdentifiers2
            cy.putApiPartnerV2("/admin/departments/id/external-identifiers", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(3000)
                expect(response.body.validations["0"][0].message).to.include("is not valid for Guid.")


            })
        })
    })
})