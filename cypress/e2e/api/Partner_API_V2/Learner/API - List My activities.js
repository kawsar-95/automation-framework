

let queryParams = {
    _limit: "20",
    _offset: "0"

}
let activityID;

describe("My Activities Test", () => {
    it("GET - List My Activities", () => {


        cy.getApiSFV2("/my-activities", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            activityID = response.body._embedded.activities[0].id
        })
    })

    it("GET - My Activity", () => {


        cy.getApiSFV2("/my-activities/" + activityID, queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(activityID)
        })
    })
})