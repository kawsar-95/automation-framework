

let categoryID;

describe("API - Categories Test", () => {

    it("GET - List of Categories", () => {

        cy.getApiV15("/categories", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            categoryID = response.body[0].Id
        })
    })


    it("GET - Category ID", () => {

        cy.getApiV15("/categories/" + categoryID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.equal(categoryID)
        })
    })
})



