


let ilcID;
let sessionID;
let classID;
let queryParams = {
    _limit: "500"
}
let queryParams2 = {
    _limit: "20",
    _offset: "0"
}
describe("ILC Copy Test", () => {
    it("GET - ILC ID", () => {


        cy.getApiSFV2("/admin/reports/sessions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcID = response.body.sessions[0].instructorLedCourseId


        })
    })

    it("GET - ILC Copy ID", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(ilcID)


        })
    })

    it("GET - List ILC Sessions", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/sessions", queryParams2 ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            sessionID = response.body._embedded.sessions[0].id


        })
    })

    it("GET - ILC Sessions", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/sessions/" + sessionID, queryParams2 ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(sessionID)


        })
    })

    it("GET - List ILC Session Classes", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/sessions/" + sessionID + "/classes", null ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            classID = response.body._embedded.classes[0].id


        })
    })

    it("GET - List ILC Session Classes", () => {


        cy.getApiSFV2("/instructor-led-courses/" + ilcID + "/sessions/" + sessionID + "/classes/" + classID, null ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(classID)


        })
    })
})