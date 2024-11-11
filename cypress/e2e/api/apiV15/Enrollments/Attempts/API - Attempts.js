import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";


let onlineCourseAlessonID;
let attemptID;

describe("API - Attempts Test", () => {

    it("GET - Lesson ID", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons" , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            onlineCourseAlessonID = response.body[0].lessonId
        })
    })
    it("GET - List user's attempts for specific lesson.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID + "/attempts" , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            attemptID = response.body[0].id
        })
    })
    it("POST - Finish attempt.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postAttempt1
            cy.postApiV15(requestBody, null,  "/attempts/" + attemptID + "/finish").then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(2500)
                expect(response.body.attemptId).to.include(attemptID)
            })
        })
    })

    it("POST - Finish attempt.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody2 = data.postAttempt2
            cy.postApiV15(requestBody2, null, "/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID + "/attempts/" + attemptID + "/finish").then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(2500)
                expect(response.body.attemptId).to.include(attemptID)
            })
        })
    })

    it("POST - Start attempt for active lesson enrollment.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody2 = data.postAttempt2
            cy.postApiV15(requestBody2, null,  "/users/learner01User" + "/enrollments/" + courses.courseAID + "/lessons/" + onlineCourseAlessonID + "/startattempt").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(2500)
                expect(response.body.message).to.include("Invalid format provided for userId")
            })
        })
    })
})