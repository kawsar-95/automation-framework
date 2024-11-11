import { courses } from "../../../../../helpers/TestData/Courses/courses";


let ocTagsID;
let queryParams = {
    _limit: "20",
    _offset: "0"
}

describe("Online Course Tags Test", () => {
    it("GET - List Online Course Tags", () => {


        cy.getApiSFV2("/online-courses/" + courses.courseAID + "/tags", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ocTagsID = response.body._embedded.tags[0].id


        })
    })
})