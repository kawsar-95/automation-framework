


let sessionID;
let instructorLedCourseID;
let queryParams = {
    _limit: "500"
}
describe("Sessions Report Test", () => {
    it("GET - List sessions", () => {


        cy.getApiSFV2("/admin/reports/sessions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            sessionID = response.body.sessions[0].id
            instructorLedCourseID = response.body.sessions[0].instructorLedCourseId


        })
    })
})