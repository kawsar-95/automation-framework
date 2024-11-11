import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";



let enrollmentID;
let queryParams = {
    courseIds: courses.courseAID,
    userIds: users.learner01.learner01UserID
}

describe("API - Course Enrollments Test", () => {
    it("GET - List enrollments for specific course.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/enrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            enrollmentID = response.body[0].Id
            cy.log(enrollmentID)
        })
    })
    it("GET - List course enrollments for bulk user list.", () => {
        cy.getApiV15("/bulk/studentcourses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].CourseId).to.include(courses.courseAID)
        })
    })
    it("GET - List course enrollments for specific user.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].UserId).to.include(users.learner01.learner01UserID)
        })
    })
    it("GET - List course enrollments for specific user.", () => {
        cy.getApiV15("/enrollments/" + enrollmentID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(500)
            expect(response.body.Id).to.equal(enrollmentID)
        })
    })
    it("GET - Get user's enrollment for specific course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(500)
            expect(response.body.CourseId).to.equal(courses.courseAID)
        })
    })
    it("GET - Get user's enrollment for specific course..", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/grades/" + courses.courseAID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(500)
            expect(response.body.CourseId).to.equal(courses.courseAID)
        })
    })
})