import { courses } from "../../../../../../helpers/TestData/Courses/courses";

let versionID;


describe("API - Course Versions Test", () => {
    
    it("GET - List Course Versions", () => {
        cy.getApiV15("/course/" + courses.courseAID + "/versions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            versionID = response.body[0].id
            
       })
    })
    it("GET - List Course Versions", () => {
        cy.getApiV15("/courseVersions/" + versionID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.id).to.include(versionID)
            
       })
    })
})