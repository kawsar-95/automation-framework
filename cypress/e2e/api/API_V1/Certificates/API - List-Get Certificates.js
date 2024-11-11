import { courses } from "../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../helpers/TestData/users/users";


let certificateID;

describe("API - Certificates Test", () => {

    it("Lists certificates for a course.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/certificates", null).then((response) => {
            expect(response.status).to.be.eq(200)
            certificateID = response.body[2].Id
        })
    })
    it("GET - Certificate", () => {
        cy.getApiV15("/certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.Id).to.include(certificateID)
        })

    })
    it("GET - Certificate for a course", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.Id).to.include(certificateID)
        })

    })
    it("GET - Certificates for the user", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/certificates", null).then((response) => {
            expect(response.status).to.be.eq(200)
            certificateID = response.body[0].Id

        })

    })
    it("GET - Certificate for the user", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.Id).to.include(certificateID)

        })

    })

})