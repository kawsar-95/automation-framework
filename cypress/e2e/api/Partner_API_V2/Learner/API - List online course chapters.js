import { courses } from "../../../../../helpers/TestData/Courses/courses";


let ocChapterID;
let queryParams = {
    _limit: "20",
    _offset: "0"
}

describe("Online Course Chapters Test", () => {
    it("GET - List Online Course Chapters", () => {


        cy.getApiSFV2("/online-courses/" + courses.courseAID + "/chapters", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ocChapterID = response.body._embedded.chapters[0].id


        })
    })

    it("GET - Get Online Course chapter", () => {


        cy.getApiSFV2("/online-courses/" + courses.courseAID + "/chapters/" + ocChapterID , null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(ocChapterID)


        })
    })
})