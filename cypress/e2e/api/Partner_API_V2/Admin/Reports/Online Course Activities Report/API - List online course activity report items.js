


let onlineCourseActivityID;

describe("Online Course Activities Report Test", () => {
    it("GET - List online course activity report items", () => {


        cy.getApiSFV2("/admin/reports/online-course-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseActivityID = response.body.onlineCourseActivities[0].id

        })
    })
})