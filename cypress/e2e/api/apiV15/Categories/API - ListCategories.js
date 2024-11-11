
let url = "/categories"
describe("API - Categories Test", () => {
    
        it("GET - List of Categories", () => {
    
            cy.getApiV15(url, null).then((response) => {
                             expect(response.status).to.be.eq(200)
                        })
                     })
    })
