




let chapterID;
let onlineCourseID;

describe("API - Online Course Test", () => {

    it("GET - List Online Courses", () => {
        cy.getApiV15("/onlineCourses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            chapterID = response.body[0].ChapterIds[0]
            onlineCourseID = response.body[0].Id

        })
    })
    it("GET -  Online Course", () => {
        cy.getApiV15("/onlineCourses/" + onlineCourseID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body).to.haveOwnProperty("Name", "Online Course with Prerequsites")
            expect(response.body.Id).to.equal(onlineCourseID)

        })
    })
})