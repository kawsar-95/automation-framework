
let sessionID;
let ilcID;
let instructorLedCourse;
let instructorLedCourses;
describe("ILCs Test", () => {
    it("GET - List ILCs", () => {
        cy.getApiV15("/instructorLedCourses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            sessionID = response.body[0].SessionIds[0]
            ilcID = response.body[0].Id

        })
    })
    it("GET -  ILCs", () => {
        cy.getApiV15("/instructorLedCourses/" + ilcID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body).to.haveOwnProperty("Name", "# ILC One A")

        })
    })
})