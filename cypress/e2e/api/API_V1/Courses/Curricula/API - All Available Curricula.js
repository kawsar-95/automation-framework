
let curriculumGroupId;
let curriculumID;
let queryParams;

describe("API - Curricula Test", () => {

    it("GET - All Available Curricula", () => {
        cy.getApiV15("/Curriculums", null).then((response) => {
            expect(response.status).to.be.eq(200)
            curriculumGroupId = response.body[0].CurriculumGroupIds[0]
            curriculumID = response.body[0].Id
            expect(response.body[0].CurriculumGroupIds[0]).to.include(curriculumGroupId)

        })
    })

    it("GET - All Available Curricula for sale", () => {
        cy.getApiV15("/Curriculums/ForSale", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body[0].CurriculumGroupIds[0]).to.include(curriculumGroupId)
            queryParams = {
                id: curriculumID
            }

        })
    })
    it("GET - An individual curriculum by ID", () => {
        cy.getApiV15("/Curriculums/", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            curriculumGroupId = response.body.CurriculumGroupIds[0]
            expect(response.body.Id).to.include(curriculumID)
            queryParams = {
                id: curriculumGroupId
            }

        })
    })
    it("GET - Curriculum Group", () => {
        cy.getApiV15("/Curriculums/CurriculumGroup", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.Id).to.include(curriculumGroupId)
            expect(response.body).to.haveOwnProperty("Name", "Group A")

        })
    })
    it("POST - Multiple Curriculum Group", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postCurricula
            cy.postApiV15(requestBody, null, "/Curriculums/MultipleCurriculumGroups").then((response) => {
                expect(response.status).to.be.eq(200)

            })
        })
    })
})