


let queryParams = {
    _filter: "type eq 'Curriculum'"
}
let curriculumCourseID;


describe("Courses Report Test", () => {

    it("GET - List course report items - Course Curriculum", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculumCourseID = response.body.courses[0].id
        })

    })




})
