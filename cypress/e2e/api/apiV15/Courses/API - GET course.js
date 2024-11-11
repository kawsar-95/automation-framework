
let onlineCourseID;

describe("API - Prerequisites", () => {

    it("GET -  Online Course Id", () => {
        cy.getApiV15("/onlineCourses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            onlineCourseID = response.body.onlineCourses[0].id

        })
    })
    it("GET -  Course", () => {
        cy.getApiV15("/courses/" + onlineCourseID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)
            expect(response.body.id).to.eq(onlineCourseID)

        })
    })
})
