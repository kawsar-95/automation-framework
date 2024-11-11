import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'


let queryParams = {
    startDate: commonDetails.timestamp,
    endDate:   commonDetails.timestamp
}


describe("Client Profile Test", () => {
    it("GET - Endpoint to provide sync events usage data.", () => {

        cy.getApiV2("/api/rest/v2/admin/my-client-profile/sync-events", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.startDate).to.exist
            expect(response.body.endDate).to.exist


        })
    })
})
