

let queryParams = {
    _filter: "type eq 'CourseBundle'"
}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}
let courseBundleID;


describe("Bundled Courses Test", () => {

    it("GET - Bundle ID", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            courseBundleID = response.body.courses[0].id
        })

    })

    it("GET - List Bundled Courses", () => {


        cy.getApiSFV2("/course-bundles/" + courseBundleID + "/courses", queryParams2).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })

    })

    it("GET - Course Bundle", () => {


        cy.getApiSFV2("/course-bundles/" + courseBundleID , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(courseBundleID)
        })

    })

})