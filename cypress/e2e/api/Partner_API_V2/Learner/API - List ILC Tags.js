

let ilcID;
let queryParams = {
    _limit: "500"
}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}

describe("ILC Tags Test", () => {
    it("GET - ILC ID", () => {


        cy.getApiSFV2("/admin/reports/sessions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcID = response.body.sessions[0].instructorLedCourseId


        })
    })

    it("GET - List ILC Tags", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/tags", queryParams2).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body._links.self.href).to.include(ilcID)


        })
    })
})