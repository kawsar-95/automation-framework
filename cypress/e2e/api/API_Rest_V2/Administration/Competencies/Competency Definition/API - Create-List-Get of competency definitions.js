


let compDefinitionID;

describe("Competency Definitions Test", () => {

    it("POST - Create competency definition", () => {

        cy.fixture('postDataRestV2').then((data) => {
            const requestBody = data.bodyCreateCompetencyDefinition
            cy.postApiV2(requestBody, null, "/api/rest/v2/admin/competency-definitions").then((response) => {
                expect(response.status).to.be.eq(201)
                expect(response.duration).to.be.below(3000)


            })
        })
    })
    it('Get Retrieves a page of competency definitions', () => {

        cy.getApiV2("/api/rest/v2/admin/competency-definitions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            compDefinitionID = response.body._embedded.competencydefinitions[0].id



        })
    })

    it('Get Gets a single competency definition resource - connected-apps', () => {

        cy.getApiV2("/api/rest/v2/connected-apps/competency-definitions/" + compDefinitionID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(compDefinitionID)



        })
    })

    it('Get Gets a single competency definition resource - admin', () => {

        cy.getApiV2("/api/rest/v2/admin/competency-definitions/" + compDefinitionID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(compDefinitionID)



        })
    })

    it('Get Retrieves a page of competency definitions - connected-apps', () => {

        cy.getApiV2("/api/rest/v2/connected-apps/competency-definitions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)



        })
    })

    it('Get Get competency definition history', () => {

        cy.getApiV2("/api/rest/v2/admin/competency-definitions/" + compDefinitionID + "/history", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(compDefinitionID)


        })
    })

    it("PUT - Update competency definition", () => {

        cy.fixture('postDataRestV2').then((data) => {
            const requestBody = data.bodyCreateCompetencyDefinition
            cy.putApiV2(requestBody, null, "/api/rest/v2/admin/competency-definitions/" + compDefinitionID).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)
                expect(response.body.id).to.equal(compDefinitionID)


            })
        })
    })
   
})