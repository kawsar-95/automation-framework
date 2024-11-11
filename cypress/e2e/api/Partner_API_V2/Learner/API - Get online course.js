import { courses } from "../../../../../helpers/TestData/Courses/courses";



describe("Online Course Test", () => {
    it("GET - Online Course", () => {


        cy.getApiSFV2("/online-courses/" + courses.courseAID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(courses.courseAID)


        })
    })
})