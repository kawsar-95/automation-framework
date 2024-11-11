let queryParams = {
    _limit: "20",
    _offset: "0"

}
let catalogCourseID;;

describe("Catalog Course Test", () => {

    it("GET - List My Catalog Courses", () => {


        cy.getApiSFV2("/my-catalog", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            catalogCourseID = response.body._embedded.courses[0].id
        })

    })

    it("GET - My Catalog Course", () => {


        cy.getApiSFV2("/my-catalog/" + catalogCourseID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(catalogCourseID)
        })

    })

   
    })
