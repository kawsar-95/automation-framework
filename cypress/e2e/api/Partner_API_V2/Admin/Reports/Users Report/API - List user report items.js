

let username01;

describe("Users Report Test", () => {
    it("GET - List user report items", () => {


        cy.getApiSFV2("/admin/reports/users", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            username01 = response.body.users[0].username


        })
    })

    it("GET - List user report items filter by username", () => {

        cy.getApiSFV2("/admin/reports/users", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            username01 = response.body.users[0].username


        })
        let queryParams = {
            _filter: "username eq '" + username01 + "'"
        }

        cy.getApiSFV2("/admin/reports/users", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.users[0].username).to.equal(username01)


        })

    })
})