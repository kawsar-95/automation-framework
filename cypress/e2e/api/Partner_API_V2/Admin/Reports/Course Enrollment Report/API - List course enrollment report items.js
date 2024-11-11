

let onlineCourseID;
let ocCompetencyDefinitionID;
let queryParams1 = {
    _filter: "type eq 'OnlineCourse'"

}


describe("Course Enrollment Report Test", () => {

    it("GET - List OC competencies", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams1).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

        let queryParams2 = {
            _filter: `courseId eq guid'${onlineCourseID}'`,
            _limit: "300"
        }


        cy.getApiSFV2("/admin/reports/course-enrollments", queryParams2).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)

        })
    })

})