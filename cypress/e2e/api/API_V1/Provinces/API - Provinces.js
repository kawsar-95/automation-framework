import { apiV15 } from "../../../../../helpers/TestData/ApiV15/apiV15";


let provinceID;
let queryParam = {
    countryId: apiV15.countryID,

}
describe("API - Provinces Test", () => {

    it("GET - List provinces in country.", () => {
        cy.getApiV15("/provinces", queryParam).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            provinceID = response.body[0].Id
        })
    })
    it("GET - Province", () => {
        cy.getApiV15("/provinces/" + provinceID, queryParam).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)
            expect(response.body.Name).to.equal("United States Minor Outlying Islands")
        })
    })
})