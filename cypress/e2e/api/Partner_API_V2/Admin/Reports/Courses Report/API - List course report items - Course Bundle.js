


let queryParams = {
    _filter: "type eq 'CourseBundle'"
}
let courseBundleID;


describe("Courses Report Test", () => {

    it("GET - List course report items - Course Bundle", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            courseBundleID = response.body.courses[0].id
        })

    })




})
