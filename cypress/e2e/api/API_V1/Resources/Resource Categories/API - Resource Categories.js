
let resourceCategoryID;
let message

describe("API - Resource Categories Test", () => {
    it("GET - Lists resource categories.", () => {
        cy.getApiV15("/resourceCategories", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            resourceCategoryID = response.body[0].Id
        })
    })
    it("GET - Get resource category.", () => {
        cy.getApiV15("/resourceCategories/" + resourceCategoryID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.equal(resourceCategoryID)
        })
    })
    it("POST - Create resource category.", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody1 = data.bodyResourceCategory1
            cy.postApiV15(requestBody1, null, "/resourceCategories").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(2500)
                expect(response.body["resourceCategoryModel.id"]._errors[0]["<Exception>k__BackingField"].InnerException.Message).to.include("Could not cast or convert from System.String to System.Guid.")
                
            })
        })
    })
    it("PUT - Update resource category.", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody = data.bodyResourceCategory2
            cy.putApiV15(requestBody, "/resourceCategories/id").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(2500)
                expect(response.body.Message).to.include("The request is invalid.")
            })
        })
    })
})