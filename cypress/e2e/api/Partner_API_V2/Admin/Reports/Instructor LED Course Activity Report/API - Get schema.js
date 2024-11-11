


describe("Instructor LED Course Report Test", () => {
    it("GET - Schema", () => {


        cy.getApiSFV2("/admin/reports/instructor-led-course-activities/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.entity.name).to.equal("InstructorLedCourseActivitiesReportItemResource")

        })
    })
})