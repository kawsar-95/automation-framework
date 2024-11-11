


let curriculumID;
let curriculumGroupID;;

describe("Competency Test", () => {
    it("GET - Get Curriculum ID", () => {


        cy.getApiSFV2("/admin/reports/curriculum-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculumID = response.body.curriculumActivities[0].curriculumId


        })
    })

    it("GET - Get Curriculum Group ID", () => {


        cy.getApiSFV2("/admin/curricula/" + curriculumID + "/groups", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculumGroupID = response.body.curriculumGroups[0].id

        })
    })

    it("GET - List Curriculum Group Courses", () => {


        cy.getApiSFV2("/admin/curricula/" + curriculumID  + "/groups/" +  curriculumGroupID + "/courses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)

        })
    })
})