

let onlineCourseID;
let ocUploadsID;
let queryParams = {
    _filter: "type eq 'OnlineCourse'"

}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}


describe("OC Uploads Test", () => {

    it("GET - OC ID", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

})

it("GET - List Online Course uploads", () => {


    cy.getApiSFV2("/online-courses/" + onlineCourseID + "/uploads", queryParams2).then((response) => {
        expect(response.status).to.be.eq(200)
        expect(response.duration).to.be.below(3000)
        ocUploadsID = response.body._embedded.uploads[0].id
    })

})
})