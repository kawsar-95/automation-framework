



let ocID;

describe("Online Course Test", () => {

    it("POST - Create OC", () => {

        cy.fixture('postDataRestV2').then((data) => {
            const requestBody = data.bodyCreateOC
            cy.postApiV2(requestBody, null, "/api/rest/v2/admin/online-courses").then((response) => {
                expect(response.status).to.be.eq(201)
                expect(response.duration).to.be.below(3000)
                ocID = response.body.id


            })
        })
    })
    it("GET - Get Course", () => {

        cy.getApiV2("/api/rest/v2/admin/online-courses/" + ocID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })

})