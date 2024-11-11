

let curriculumID;
let currResourceID;
let queryParams = {
    _limit: "20",
    _offset: "0"
}

describe("Curricula Prerequisites Test", () => {
    it("GET - curriculum ID", () => {


        cy.getApiSFV2("/admin/reports/curriculum-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculumID = response.body.curriculumActivities[0].curriculumId


        })
    })

    it("GET - List Curricula Prerequisites", () => {


        cy.getApiSFV2("/curricula/" + curriculumID + "/prerequisites", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })

    it("GET - List Curricula resources", () => {


        cy.getApiSFV2("/curricula/" + curriculumID + "/resources", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            currResourceID = response.body._embedded.resources[0].id


        })
    })

    it("GET - LGet Curricula resource", () => {


        cy.getApiSFV2("/curricula/" + curriculumID + "/resources/" + currResourceID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(currResourceID)


        })
    })
})