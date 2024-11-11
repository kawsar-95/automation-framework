


let categoryID;

describe("Competency Categories Test", () => {
    it('Get List Competency Categories', () => {

        cy.getApiV2("/api/rest/v2/admin/competency-categories", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            categoryID = response.body._embedded.competencyCategories[0].id
            cy.log(categoryID)



        })
    })

    it('Get competency category', () => {

        cy.getApiV2("/api/rest/v2/admin/competency-categories/" + categoryID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(categoryID)



        })
    })


    it("PUT - Update competency category", () => {

        cy.fixture('postDataRestV2').then((data) => {
            const requestBody = data.bodyUpdateCompetencyCategory
            cy.putApiV2(requestBody, "/api/rest/v2/admin/competency-categories/" + categoryID).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)


            })
        })
    })

    it('DELETE competency category', () => {

        cy.deleteApiV2("/api/rest/v2/admin/competency-categories/" + categoryID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)



        })
    })
})
