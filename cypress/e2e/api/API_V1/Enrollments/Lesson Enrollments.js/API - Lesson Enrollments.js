import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";



let onlineCourseAlessonID;
let chapterID;

describe("API - Lesson Enrollments Test", () => {
    before("Get chapterID", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/chapters", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            chapterID = response.body[0].ChapterId

        })
    })

    it("GET - List user's lesson enrollments from specific course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            onlineCourseAlessonID = response.body[0].LessonId
            expect(response.body[0].UserId).to.equal(users.learner01.learner01UserID)
        })
    })
    it("GET - Lists enrollments for a lesson.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID + "/enrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].LessonId).to.equal(onlineCourseAlessonID)
            expect(response.body[0]).to.have.property("ChapterEnrollmentId")
        })
    })
    it("GET - List user's lesson enrollments from specific chapter.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/chapters/" + chapterID + "/lessons/" + onlineCourseAlessonID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.UserId).to.equal(users.learner01.learner01UserID)
        })
    })
    it("GET - Get user's lesson enrollment.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.UserId).to.equal(users.learner01.learner01UserID)
        })
    })
})