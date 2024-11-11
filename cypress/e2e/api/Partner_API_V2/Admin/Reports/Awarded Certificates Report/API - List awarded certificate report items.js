

let certificateID;

describe("Awarded Certificates Test", () => {
    it("GET - List awarded certificate report items", () => {


        cy.getApiSFV2("/admin/reports/awarded-certificates", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            certificateID = response.body.certificates[0].id
            
        })
    })
})