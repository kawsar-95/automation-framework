


let ilcID;
let ilcCompetencyID;
let queryParams = {
    _limit: "500"
}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}

describe("ILC Copmpetencies Test", () => {
    it("GET - ILC ID", () => {


        cy.getApiSFV2("/admin/reports/sessions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcID = response.body.sessions[0].instructorLedCourseId


        })
    })

    it("GET - List ILC Competencies", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/competencies", queryParams2).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcCompetencyID = response.body._embedded.competencies[0].id


        })
    })
    it("GET - ILC Competency", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/competencies/" + ilcCompetencyID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).ordered.equal(ilcCompetencyID)


        })
    })
})