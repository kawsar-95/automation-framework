



let ilcID;
let queryParams = {
    _limit: "500"
}

describe("ILC prerequisites Test", () => {
    it("GET - ILC ID", () => {


        cy.getApiSFV2("/admin/reports/sessions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcID = response.body.sessions[0].instructorLedCourseId


        })
    })

    it("GET - List ILC prerequisites", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/prerequisites", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body._links.self.href).to.include(ilcID)


        })
    })
})