



describe("Competency Category Test", () => {

    it("POST - Create competency category", () => {

        cy.fixture('postDataRestV2').then((data) => {
            const requestBody = data.bodyCreateCompetencyCategory
            cy.postApiV2(requestBody, null, "/api/rest/v2/admin/competency-categories").then((response) => {
                expect(response.status).to.be.eq(201)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
})