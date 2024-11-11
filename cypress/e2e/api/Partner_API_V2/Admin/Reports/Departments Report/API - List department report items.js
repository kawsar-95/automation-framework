

let departmentID;

describe("Departments Report Test", () => {
    it("GET - List department report items", () => {


        cy.getApiSFV2("/admin/reports/departments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            departmentID = response.body.departments[0].id

        })
    })
})