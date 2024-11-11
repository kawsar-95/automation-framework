


describe("Course Enrollment Report Test", () => {
    it("GET - Get schema", () => {


        cy.getApiSFV2("/admin/reports/course-enrollments/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.entity.name).to.equal("CourseEnrollmentReportItemResource")

        })
    })
})