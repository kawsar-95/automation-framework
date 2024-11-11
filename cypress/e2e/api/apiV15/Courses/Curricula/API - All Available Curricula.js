
let curriculumGroupId;
let curriculumID;

describe("API - Curricula Test", () => {
   
    it("GET - All Available Curricula", () => {
        cy.getApiV15("/Curriculums", null).then((response) => {
            expect(response.status).to.be.eq(200)
            curriculumGroupId = response.body[0].curriculumGroupIds[0]
            curriculumID = response.body[0].id
            expect(response.body[0].curriculumGroupIds[0]).to.include(curriculumGroupId)
            
       })
    })

    it("GET - All Available Curricula for sale", () => {
        cy.getApiV15("/Curriculums/ForSale", null).then((response) => {
            expect(response.status).to.be.eq(200)
            curriculumGroupId = response.body[0].curriculumGroupIds[0]
            expect(response.body[0].curriculumGroupIds[0]).to.include(curriculumGroupId)
            
       })
    })
    it("GET - An individual curriculum by ID", () => {
        cy.getApiV15("/Curriculums/" + curriculumID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            curriculumGroupId = response.body.curriculumGroupIds[0]
            expect(response.body.id).to.include(curriculumID)
            
       })
    })
    it("GET - Curriculum Group", () => {
        cy.getApiV15("/Curriculums/CurriculumGroup?acd97016-1119-48ea-9bfc-508053f67a4e=", null).then((response) => {
            expect(response.status).to.be.eq(404)
            expect(response.body.message).to.include('No curricula group(s) were found')
            
       })
    })
    it("POST - Multiple Curriculum Group", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postCurricula
        cy.postApiV15(requestBody, null, "/Curriculums/MultipleCurriculumGroups").then((response) => {
            expect(response.status).to.be.eq(400)
            expect(response.body.message).to.include('No curricula group(s) were found')
            
       })
    })
    })
})