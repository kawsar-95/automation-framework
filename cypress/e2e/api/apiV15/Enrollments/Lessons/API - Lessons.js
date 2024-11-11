import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users";


let onlineCourseAlessonID;

describe("API -  Lessons Test", () => {
    it("GET - List user's lesson enrollments from specific course.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/lessons", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            onlineCourseAlessonID = response.body[0].lessonId
        })
    })
    it("GET -  Get Lessons", () => {
        cy.getApiV15("/lessons/" + onlineCourseAlessonID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })

    it("GET -  Get Lessons of a course", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/lessons", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })

    it("GET -  Get Chapters of a course", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/chapters", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
})