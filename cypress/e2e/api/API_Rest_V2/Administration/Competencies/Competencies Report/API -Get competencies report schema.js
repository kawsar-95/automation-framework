




describe("Competencies Report Test", () => {
    it('Get Get competencies report schema', () => {

        cy.getApiV2("/api/rest/v2/admin/reports/competencies/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})
