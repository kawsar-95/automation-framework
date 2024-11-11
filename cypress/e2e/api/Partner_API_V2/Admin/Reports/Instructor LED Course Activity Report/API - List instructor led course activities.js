


let instructorLedCourseActivitieID;
let instructorLedCourseEnrollmentID;
let sessionEnrollmentID;

describe("Instructor LED Course Report Test", () => {
    it("GET - List instructor led course activities", () => {


        cy.getApiSFV2("/admin/reports/instructor-led-course-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            instructorLedCourseActivitieID = response.body.instructorLedCourseActivities[0].id
            instructorLedCourseEnrollmentID = response.body.instructorLedCourseActivities[0].instructorLedCourseEnrollmentId
            sessionEnrollmentID = response.body.instructorLedCourseActivities[0].sessionEnrollmentId

        })
    })
})