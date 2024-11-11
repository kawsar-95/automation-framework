
let tagID;

describe("API -  Tags Test", () => {
    it("GET - Lists Tags.", () => {
        cy.getApiV15("/tags", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            tagID = response.body[1].Id
        })
    })
    it("GET - Tag.", () => {
        cy.getApiV15("/tags/" + tagID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.equal(tagID)
        })
    })
    it("POST - Create Tag.", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody = data.bodyTags1
            cy.postApiV15(requestBody, null, "/tags").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(2500)
                expect(response.body["tagModel.Name"]._errors[0]["<ErrorMessage>k__BackingField"]).to.include("The Name field is required.")
            })
        })
    })
    it("PUT - Update Tag.", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody = data.bodyTags2
            cy.putApiV15(requestBody, "/tags/" + tagID).then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(2500)
                expect(response.body["tagModel.Name"]._errors[0]["<ErrorMessage>k__BackingField"]).to.include("The Name field is required.")

            })
        })
    })
})