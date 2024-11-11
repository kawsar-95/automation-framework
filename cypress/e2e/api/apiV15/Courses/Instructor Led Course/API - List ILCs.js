
let sessionID;
let ilcID;
let instructorLedCourse;
let instructorLedCourses;
describe("ILCs Test", () => {
    it("GET - List ILCs", () => {
        cy.getApiV15("/instructorLedCourses", null).then((response) => {
         expect(response.status).to.be.eq(200)
         expect(response.duration).to.be.below(2500)
         sessionID = response.body.instructorLedCourses[0].sessionIds[0]
         ilcID = response.body.instructorLedCourses[0].id
         instructorLedCourse = response.body.instructorLedCourses[0]
         instructorLedCourses = JSON.stringify(instructorLedCourse)
            
       })
    })
    it("GET -  ILCs", () => {
        cy.getApiV15("/instructorLedCourses/"+ ilcID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            let responseString = JSON.stringify(response.body)
            expect(responseString).to.eq(instructorLedCourses)
            
       })
    })
})