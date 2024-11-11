


let url = "/instructor-led-course-sessions/a705cb28-305f-4f7c-a755-8273457265fc/session-schedules/a705cb28-305f-4f7c-a755-8273457265fc/attendance"
describe("Attendance Test", () => {

    it("GET - List of Attendance Records", () => {

        cy.getApiV15(url, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
})