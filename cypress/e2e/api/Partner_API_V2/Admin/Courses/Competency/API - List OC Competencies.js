

let onlineCourseID;
let ocCompetencyDefinitionID;
let queryParams = {
    _filter: "type eq 'OnlineCourse'"

}


describe("Competency Test", () => {

    it("GET - OC ID", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

    })

    it("GET - List OC competencies", () => {


        cy.getApiSFV2("/admin/online-courses/" + onlineCourseID + "/competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ocCompetencyDefinitionID = response.body.competencies[0].competencyDefinitionId

        })
    })

})

