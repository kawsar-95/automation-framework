





let queryParams = {
    _filter: "type eq 'InstructorLedCourse'"
}
let ILCCourseID;


describe("Courses Report Test", () => {

    it("GET - List course report items - Course InstructorLedCourse", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ILCCourseID = response.body.courses[0].id
        })

    })




})
