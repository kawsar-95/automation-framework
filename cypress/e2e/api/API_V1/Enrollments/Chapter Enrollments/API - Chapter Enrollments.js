import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";


let chapterID;


describe("API - Chapter Enrollments Test", () => {

    it("GET - List chapter enrollments for a specified course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/chapters", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            chapterID = response.body[0].ChapterId

        })
    })
    it("GET - List chapter enrollments for a specified course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/chapters/" + chapterID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.ChapterId).to.equal(chapterID)
        })
    })
})