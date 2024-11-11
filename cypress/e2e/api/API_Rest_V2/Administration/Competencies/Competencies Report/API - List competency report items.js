

describe("Competencies Report Test", () => {
    it('Get List Competency Report Items', () => {

        cy.getApiV2("/api/rest/v2/admin/reports/competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})
