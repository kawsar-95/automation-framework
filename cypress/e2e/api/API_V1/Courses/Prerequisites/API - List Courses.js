import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";


let prerequisiteID;

describe("API - Prerequisites Test", () => {
    it("GET - List Courses", () => {
        cy.getApiV15("/courses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)

        })
    })
    it("GET -  Course", () => {
        cy.getApiV15("/courses/" + courses.courseAID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)

        })
    })
    it("GET -  Courses for sale", () => {
        cy.getApiV15("/courses/forsale", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)

        })
    })
    it("GET -  List currently authenticated user's available courses from catalog", () => {
        cy.getApiV15("/mycatalog", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)

        })
    })
    it("GET -  List currently authenticated user's available courses", () => {
        cy.getApiV15("/mycourses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)

        })
    })
    it("GET -  List user's available courses from catalog", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/catalog", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)

        })
    })
    it("GET -  List user's available courses", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/courses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)

        })
    })
    it("GET -  List prerequisites for a specific course", () => {
        cy.getApiV15("/course/" + courses.courseCID + "/prerequisites", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)
            prerequisiteID = response.body[0].Id

        })
    })
    it("GET -  List prerequisites", () => {
        cy.getApiV15("/prerequisites", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)
            let hasID = response.body.some(item => item.Id === prerequisiteID)
            expect(hasID).to.be.true

        })
    })
    it("GET -  Prerequisite", () => {
        cy.getApiV15("/prerequisites/" + prerequisiteID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.eq(prerequisiteID)

        })
    })
})