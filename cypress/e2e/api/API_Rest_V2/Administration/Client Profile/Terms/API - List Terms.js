


let languageCode;

describe("Terms Test", () => {
    before('Get Language Code', () => {

        cy.getApiV2("/api/rest/v2/admin/my-client-profile/languages", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            languageCode = response.body._embedded.languages[0].code


        })
    })

    it("GET - List Terms", () => {

        cy.getApiV2("/api/rest/v2/admin/terms/" + languageCode, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})
