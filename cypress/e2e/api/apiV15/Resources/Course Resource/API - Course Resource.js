import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";



let courseResourceID;

describe("API - Course Resource Test", () => {
    it("GET - List resources from a specific course.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/resources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            courseResourceID = response.body[0].id
        })
    })
    it("GET - Get resource from a specific course.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/resources/" + courseResourceID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(courseResourceID)
        })
    })
    it("GET - List resources associated with a specified enrollment for a specific user.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/enrollments/" + courses.courseAID + "/resources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].id).to.equal(courseResourceID)
        })
    })
    it("GET - List resources available from a specific course for the current authenticated user.", () => {
        cy.getApiV15("/enrollments/" + courses.courseAID + "/myresources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].id).to.equal(courseResourceID)
        })
    })
})