import { users } from "../../../../../../helpers/TestData/users/users";

let onlineCourseID;
let chapterID;


describe("API - Chapter Enrollments Test", () => {
    it("GET - Lesson ID", () => {
        cy.getApiV15("/onlineCourses" , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            onlineCourseID = response.body.onlineCourses[0].id
        })
    })
    it("GET - List chapter enrollments for a specified course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + onlineCourseID + "/chapters" , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            chapterID = response.body[0].chapterId
        })
    })
    it("GET - List chapter enrollments for a specified course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + onlineCourseID + "/chapters/" + chapterID , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.chapterId).to.equal(chapterID)
        })
    })
})