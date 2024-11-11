

let onlineCourseID;
let ocBadgeID;
let queryParams = {
    _filter: "type eq 'OnlineCourse'"

}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}


describe("OC Badges Test", () => {

    it("GET - OC ID", () => {


        cy.getApiSFV2("/admin/reports/courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            onlineCourseID = response.body.courses[0].id
        })

    })

    it("GET - List Online Course Badges", () => {


        cy.getApiSFV2("/online-courses/" + onlineCourseID + "/badges", queryParams2).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ocBadgeID = response.body._embedded.badges[0].id
        })

    })

    it("GET - Get Online Course badge", () => {


        cy.getApiSFV2("/online-courses/" + onlineCourseID + "/badges/" + ocBadgeID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(ocBadgeID)
        })

    })


})
