



let departmentID;

describe("API - Departments Test", () => {

    it("GET - Lists all selected LMS Departments that are available to the current, authenticated administrator.", () => {

        cy.getApiV15("/departments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            departmentID = response.body[0].Id
        })
    })

    it("POST - Create or Update Department.", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody = data.bodyPostDepartment1
            cy.postApiV15(requestBody, null, "/departments").then((response) => {
                expect(response.status).to.be.eq(201)
                expect(response.duration).to.be.below(2500)
            })
        })
    })

    it("POST - Create or Update Department.(Not Found)", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody2 = data.bodyPostDepartment2
            cy.postApiV15(requestBody2, null, "/createdepartment").then((response) => {
                expect(response.status).to.be.eq(201)
                expect(response.duration).to.be.below(2500)
            })
        })
    })

    it("GET -  Department.", () => {

        cy.getApiV15("/departments/" + departmentID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(500)
            expect(response.body.Id).to.eq(departmentID)
            expect(response.body).to.haveOwnProperty("Name", "API-Auto")
        })
    })
})

