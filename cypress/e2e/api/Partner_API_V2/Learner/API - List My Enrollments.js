

let queryParams = {
    _limit: "20",
    _offset: "0"

}
let enrollmentID;

describe("Enrollments Test", () => {

    it("GET - List My Enrollments", () => {


        cy.getApiSFV2("/my-enrollments", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            enrollmentID = response.body._embedded.enrollments[0].id
        })

    })

    it("GET - My Enrollment", () => {


        cy.getApiSFV2("/my-enrollments/" + enrollmentID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(enrollmentID)
        })

    })



})