

let onlineCourseID;
let ocCompetencyID;
let queryParams = {
    _filter: "type eq 'OnlineCourse'"

}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}


describe("OC Competencies Test", () => {

    it("GET - OC ID", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

})

it("GET - List Online Course Competencies", () => {


    cy.getApiSFV2("/online-courses/" + onlineCourseID + "/competencies", queryParams2).then((response) => {
        expect(response.status).to.be.eq(200)
        expect(response.duration).to.be.below(3000)
        ocCompetencyID = response.body._embedded.competencies[0].id
    })

})


    it("GET -  Online Course Competency", () => {


        cy.getApiSFV2("/online-courses/" + onlineCourseID + "/competencies/" + ocCompetencyID , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body._links.self.href).to.include(ocCompetencyID)
            expect(response.body._links.self.href).to.include(onlineCourseID)
        })

    })
})