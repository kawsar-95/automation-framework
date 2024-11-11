

let onlineCourseID;
let ocResourceID;
let queryParams = {
    _filter: "type eq 'OnlineCourse'"

}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}


describe("OC Resources Test", () => {

    it("GET - OC ID", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

})

it("GET - List Online Course resources", () => {


    cy.getApiSFV2("/online-courses/" + onlineCourseID + "/resources", queryParams2).then((response) => {
        expect(response.status).to.be.eq(200)
        expect(response.duration).to.be.below(3000)
        ocResourceID = response.body._embedded.resources[0].id
    })

})
})