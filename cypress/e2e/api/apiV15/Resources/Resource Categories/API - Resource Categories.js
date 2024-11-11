
let resourceCategoryID;


describe("API - Resource Categories Test", () => {
    it("GET - Lists resource categories.", () => {
        cy.getApiV15("/resourceCategories", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            resourceCategoryID = response.body[0].id
        })
    })
    it("GET - Get resource category.", () => {
        cy.getApiV15("/resourceCategories/" + resourceCategoryID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(resourceCategoryID)
        })
    })
    it("POST - Create resource category.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody1 = data.bodyResourceCategory1
            cy.postApiV15(requestBody1, null, "/resourceCategories").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(2500)
                expect(response.body.validations['0'][0].message).to.include("The Name field is required.")
            })
        })
    })
    it("PUT - Update resource category.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyResourceCategory2
            cy.putApiV15(requestBody, "/resourceCategories/id").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(2500)
                expect(response.body.message).to.include("Invalid format provided for id")
            })
        })
    })
})