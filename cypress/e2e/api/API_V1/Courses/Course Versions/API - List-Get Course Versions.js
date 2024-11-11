import { courses } from "../../../../../../helpers/TestData/Courses/courses";

let versionID;
let queryParams;

describe("API - Course Versions Test", () => {
    
    it("GET - List Course Versions", () => {
        cy.getApiV15("/course/" + courses.courseAID + "/versions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            versionID = response.body[0].Id
            queryParams = {
                id:versionID
            }
            
       })
    })
    it("GET - List Course Versions", () => {
        cy.getApiV15("/courseVersions/" + versionID,  queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.Id).to.include(versionID)
            
       })
    })
})