import { workspaceDetails } from "../../../../../../../helpers/TestData/Workspaces/workspaceDetails";



let workspaceID;
let url = "/api/rest/v2/admin/create/workspaces/"
let requestBody = {
    name: workspaceDetails.workspaceName
}
let requestBody2 = {
    name: workspaceDetails.workspaceName2
}

describe("Workspaces Test", () => {

    it("POST - Create an Absorb Create workspace", () => {

        cy.postApiV2(requestBody, null, url).then((response) => {
            expect(response.status).to.be.eq(201)
            expect(response.duration).to.be.below(3000)
            workspaceID = response.body.id


        })
    })
    it('Get  Absorb Create workspace', () => {

        cy.getApiV2(url + workspaceID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(workspaceID)


        })
    })

    it('Get  List Absorb Create workspaces', () => {

        cy.getApiV2(url, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body._embedded.workspaces.some(workspaces => workspaces.id === workspaceID)).to.be.true

        })
    })

    it("PUT - Update an Absorb Create workspace", () => {

        cy.putApiV2(requestBody2, null, url + workspaceID).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })

    it('DELETE   Absorb Create workspace', () => {

        cy.deleteApiV2(url+ workspaceID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })

})