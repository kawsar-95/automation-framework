
let courseBundleID;

describe("API - Course Bundle Test", () => {
    it("GET - List All Available Course Bundles", () => {
        cy.getApiV15("/coursebundles", null).then((response) => {
            expect(response.status).to.be.eq(200)
            courseBundleID = response.body[0].id
            
       })
    })

    it("GET -  Course Bundle ID", () => {
        cy.getApiV15("/coursebundles/" + courseBundleID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.id).to.include(courseBundleID)
            
       })
    })
    it("GET -  List Course Bundles for sale", () => {
        cy.getApiV15("/coursebundles/forsale", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body[0].id).to.include(courseBundleID)
            
       })
    })
  
})