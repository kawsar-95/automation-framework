


let endpoint = "/instructor-led-course-sessions/a705cb28-305f-4f7c-a755-8273457265fc/session-schedules/a705cb28-305f-4f7c-a755-8273457265fc/attendance"
describe("Attendance Test", () => {

    it("POST - Create Attendance Record", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody = data.bodyAttendance1
            cy.postApiV15(requestBody, null, endpoint).then((response) => {
                expect(response.status).to.be.eq(404)
            })
        })
    })
})