import { courses } from "../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../helpers/TestData/users/users";


let certificateID;
let certificates;
let certificate;

describe("API - Certificates Test", () => {

    it("Lists certificates for a course.", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/certificates", null).then((response) => {
            expect(response.status).to.be.eq(200)
            certificateID = response.body[2].id
        })
    })
    it("GET - Certificate", () => {
        cy.getApiV15("/certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.id).to.include(certificateID)
        })

    })
    it("GET - Certificate for a course", () => {
        cy.getApiV15("/courses/" + courses.courseAID + "/certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.id).to.include(certificateID)
        })

    })
    it("GET - Certificates for the user", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/certificates", null).then((response) => {
            expect(response.status).to.be.eq(200)
            certificates = response.body.certificates
            certificate = certificates.find(certificate => certificate.id === certificateID)
            expect(certificate).to.not.be.undefined
        })

    })
    it("GET - Certificate for the user", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/certificates/" + certificateID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.id).to.include(certificateID)

        })

    })

})