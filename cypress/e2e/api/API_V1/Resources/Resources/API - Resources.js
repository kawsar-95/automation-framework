import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";



let courseResourceID;
let resource;

describe("API -  Resource Test", () => {
    it("GET - List resources for the current authenticated user.", () => {
        cy.getApiV15("/enrollments/myresources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
    it("GET - List resources from a specific course.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/resources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            courseResourceID = response.body[0].Id
        })
    })
    it("GET - Get resource.", () => {
        cy.getApiV15("/resources/" + courseResourceID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
    it("GET - List resource.", () => {
        cy.getApiV15("/resources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            resource = response.body.find(item => item.Id === courseResourceID)
            expect(resource).to.not.be.undefined
        })
    })
    it("GET - List resources available to a specific user.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/resources", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            resource = response.body.find(item => item.Id === courseResourceID)
            expect(resource).to.not.be.undefined
        })
    })
})