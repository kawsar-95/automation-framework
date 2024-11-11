

let curriculumActivitiesID;

describe("Curriculum Activities Report Test", () => {
    it("GET - List curriculum activity report items", () => {


        cy.getApiSFV2("/admin/reports/curriculum-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculumActivitiesID = response.body.curriculumActivities[0].id
            

        })
    })
})