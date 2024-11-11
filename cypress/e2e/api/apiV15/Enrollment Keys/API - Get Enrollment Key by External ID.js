


describe("API -  Enrollment Key Test", () => {
  let enrollmentKeyID;

  it("GET - Enrollment Key by External ID", () => {
    cy.fixture('apiV15').then((data) => {
      enrollmentKeyID = data.enrollmentKeyID
      let params = {
        externalId: enrollmentKeyID
      }
      cy.getApiV15("/enrollmentKeys", params).then((response) => {
        expect(response.status).to.be.eq(404)
        expect(response.duration).to.be.below(2500)
        expect(response.body.message).to.eq("Enrollment key with specified external ID not found.")
      })
    })

  })
  it("POST - Create Enrollment Key", () => {
    cy.fixture('postDataV15').then((data) => {
      const requestBody = data.postEnrollmentKeys1
      cy.postApiV15(requestBody, null,  "/enrollmentKeys").then((response) => {
        expect(response.status).to.be.eq(422)
        expect(response.duration).to.be.below(500)
        let validationMessage = response.body.validations["0"].find(validation => validation.message === "The KeyName field is required.")
        expect(validationMessage.message).to.equal("The KeyName field is required.")
      })
    })
  })

  it("GET - Enrollment Key", () => {
    cy.getApiV15("/enrollmentKeys/" + enrollmentKeyID, null).then((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.duration).to.be.below(2500)
      expect(response.body.id).to.eq(enrollmentKeyID)
    })
  })

  it("POST - Update Enrollment Key", () => {
    cy.fixture('postDataV15').then((data) => {
      const requestBody = data.postEnrollmentKeys2
      cy.postApiV15(requestBody, null,  "/enrollmentKeys/enrollmentkey").then((response) => {
        expect(response.status).to.be.eq(422)
        expect(response.duration).to.be.below(2500)
        expect(response.body.message).to.equal("Invalid format provided for enrollmentKeyId")
      })
    })
  })
})