

let onlineCourseID;
let queryParams = {
    _filter: "type eq 'OnlineCourse'"

}


describe("Courses Report Test", () => {

    it("GET - List course report items - Online Courses", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

    })




})
