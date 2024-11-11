

let ilcID;
let sessionID;

describe("Class Test", () => {
    it("GET - ILC ID", () => {


        cy.getApiSFV2("/admin/reports/instructor-led-course-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcID = response.body.instructorLedCourseActivities[0].courseId


        })
    })

    it("GET - Session ID", () => {


        cy.getApiSFV2("/admin/reports/sessions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            sessionID = response.body.sessions[0].id


        })
    })

    it("GET - List Classes", () => {


        cy.getApiSFV2("/admin/instructor-led-courses/" + ilcID + "/sessions/" + sessionID + "/classes", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body._links.self.href).to.include(sessionID)


        })
    })
})