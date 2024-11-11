



let sessionID;
let classID;
let ILCCourseEnrollmentID;;
let queryParams = {
    _limit: "500"
}
describe("Instructor Led Course Test", () => {
    it("GET - Session ID", () => {


        cy.getApiSFV2("/admin/reports/sessions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            sessionID = response.body.sessions[0].id


        })
    })

    it("GET - Get attendances for the given session ID.", () => {


        cy.getApiSFV2("/admin/instructor-led-course-enrollments/sessions/" + sessionID + "/attendances", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.attendances[0].sessionId).to.equal(sessionID)
            classID = response.body.attendances[0].classId
            ILCCourseEnrollmentID = response.body.attendances[0].courseEnrollmentId



        })
    })
})