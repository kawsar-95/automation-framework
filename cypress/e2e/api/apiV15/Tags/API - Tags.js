
let tagID;

describe("API -  Tags Test", () => {
    it("GET - Lists Tags.", () => {
        cy.getApiV15("/tags", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            tagID = response.body[1].id
        })
    })
    it("GET - Tag.", () => {
        cy.getApiV15("/tags/" + tagID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(tagID)
        })
    })
    it("POST - Create Tag.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyTags1
            cy.postApiV15(requestBody, null, "/tags").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(2500)
                expect(response.body.validations['0'][0].message).to.include("The Name field is required.")
            })
        })
    })
    it("PUT - Update Tag.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.bodyTags2
            cy.putApiV15(requestBody, "/tags/579dc1e6-e983-4543-917c-f524115db142").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(2500)
                expect(response.body.validations['0'][0].message).to.include("The Name field is required.")
            })
        })
    })
})