import { courses } from "../../../../../../helpers/TestData/Courses/courses";




describe("API - My Enrollments Test", () => {
    it("GET - List currently authenticated user's course enrollments.", () => {
        cy.getApiV15("/myenrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
    it("GET - Get currently authenticated user's course enrollment.", () => {
        cy.getApiV15("/myenrollments/" + courses.courseAID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(500)
            expect(response.body.courseId).to.equal(courses.courseAID)
        })
    })
})