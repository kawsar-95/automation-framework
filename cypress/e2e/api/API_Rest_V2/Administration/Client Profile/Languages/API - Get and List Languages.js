


let languageCode;

describe("Languages Test", () => {
    it("GET - List Languages", () => {

        cy.getApiV2("api/rest/v2/admin/my-client-profile/languages", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            languageCode = response.body._embedded.languages[0].code


        })
    })

    it("GET - Get Language", () => {

        cy.getApiV2("/api/rest/v2/admin/my-client-profile/languages/" + languageCode, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.code).to.equal(languageCode)


        })
    })
})
