

describe("API -  Enrollment Test", () => {

    it("POST - Create or Update Course Enrollment", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postEnrollment1
            cy.postApiV15(requestBody, null,"/users/userId/enrollments").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(500)
                expect(response.body.message).to.equal("Invalid format provided for userId")
            })
        })
    })

    it("POST - Create enrollment for user and course.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postEnrollment1
            cy.postApiV15(requestBody,null, "/users/userId/enrollments/courseId").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(500)
                expect(response.body.message).to.equal("Invalid format provided for userId")

            })
        })
    })
    it("POST - Un-enroll users from courses.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postEnrollment1
            cy.postApiV15(requestBody, null,"/enrollments/unenroll").then((response) => {
                expect(response.status).to.be.eq(400)
                expect(response.duration).to.be.below(500)
                expect(response.body.message).to.equal("Request requires at least 1 enrollment ID.")

            })
        })
    })
    it("POST - Create course enrollment for the currently authenticated user.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postEnrollment1
            cy.postApiV15(requestBody, null, "/enroll/courseId").then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.duration).to.be.below(500)
                expect(response.body.message).to.equal("Invalid format provided for courseId")

            })
        })
    })
})