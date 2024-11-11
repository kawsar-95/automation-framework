import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";




let sessionID;
let queryParams = {
    reEnroll: '',
    cancelSession: ''
}

describe("API - Session Enrollment Test", () => {
    it("GET - List user's session enrollments for specific course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.ilcOneID + "/sessions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            sessionID = response.body[0].SessionId
        })
    })
    it("GET - List an ILC's session enrollments.", () => {
        cy.getApiV15("/courses/" + courses.ilcOneID + "/sessions/" + sessionID + "/enrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].SessionId).to.equal(sessionID)
        })
    })
    it("GET - Get user's session enrollment for specific course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.ilcOneID + "/sessions/" + sessionID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.SessionId).to.equal(sessionID)
        })
    })
    it("POST - Create ILC enrollment for user.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postEnrollment1
            cy.postApiV15(requestBody, queryParams, "/users/userId/enrollments/courseId/session/sessionId").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(1000)
                expect(response.body.Message).to.equal("The request is invalid.")
            })
        })
    })
})
