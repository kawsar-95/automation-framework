

let chapterID;
let onlineCourseID;
let onlineCourse;
let responseBody;

describe("API - Online Course Test", () => {

    it("GET - List Online Courses", () => {
        cy.getApiV15("/onlineCourses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            chapterID = response.body.onlineCourses[0].chapterIds[0]
            onlineCourseID = response.body.onlineCourses[0].id
            onlineCourse = JSON.stringify(response.body.onlineCourses[0])
            cy.log(chapterID)
            cy.log(onlineCourseID)
            
       })
    })
    it("GET -  Online Course", () => {
        cy.getApiV15("/onlineCourses/" + onlineCourseID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            responseBody = JSON.stringify(response.body)
            expect(responseBody).to.eq(onlineCourse)
            
       })
    })
})