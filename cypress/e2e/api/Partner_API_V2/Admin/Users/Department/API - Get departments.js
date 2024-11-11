

let departmentID;

describe("DepartmentsTest", () => {

    it("GET - Get Department ID", () => {


        cy.getApiSFV2("/admin/reports/departments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            departmentID = response.body.departments[1].id


        })
    })

    it("GET - Get Departments ", () => {


        cy.getApiSFV2("/admin/departments/" + departmentID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(departmentID)


        })
    })

    it("GET - Get sub-departments", () => {


        cy.getApiSFV2("/admin/departments/" + departmentID + "/sub-departments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })


    it("POST - Create department", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyCreateDepartment
            cy.postPartnerApiV2(requestBody, null, "/admin/departments/" + departmentID + "/sub-departments").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(3000)
                expect(response.body.validations["0"][0].message).to.equal("The Name field is required.")


            })
        })
    })
    it("PAtch - Update department", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyUpdateDepartment
            cy.patchPartnerApiV2(requestBody, null, "/admin/departments/id").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(3000)


            })
        })
    })

})