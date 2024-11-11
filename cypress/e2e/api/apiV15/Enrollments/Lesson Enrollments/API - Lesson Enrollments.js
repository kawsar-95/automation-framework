import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";



let onlineCourseAlessonID;
let chapterID;

describe("API - Lesson Enrollments Test", () => {
    it("GET - List user's lesson enrollments from specific course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            onlineCourseAlessonID = response.body[0].lessonId
            expect(response.body[0].userId).to.equal(users.learner01.learner01UserID)
        })
    })
    it("GET - Lists enrollments for a lesson.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID + "/enrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            chapterID = response.body.lessonEnrollments[0].chapterId
            expect(response.body.lessonEnrollments[0].lessonId).to.equal(onlineCourseAlessonID)
            expect(response.body.lessonEnrollments[0]).to.have.property("chapterEnrollmentId")
        })
    })
    it("GET - List user's lesson enrollments from specific chapter.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/chapters/" + chapterID + "/lessons/" + onlineCourseAlessonID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.userId).to.equal(users.learner01.learner01UserID)
        })
    })
    it("GET - Get user's lesson enrollment.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.userId).to.equal(users.learner01.learner01UserID)
        })
    })
})