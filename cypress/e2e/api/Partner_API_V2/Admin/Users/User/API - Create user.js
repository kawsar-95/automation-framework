

let departmentID;

describe("Users Test", () => {

    it("POST - Create user", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyCreateUser
            cy.postPartnerApiV2(requestBody, null, "/admin/users").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(3000)
                expect(response.body.validations["0"][0].message).to.equal("Request Model Validation Error")


            })
        })
    })
})