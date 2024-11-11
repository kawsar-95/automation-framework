



let url = "/instructor-led-course-sessions/{sessionId}/session-schedules/{sessionScheduleId}/attendance/{id}"
describe("Attendance Test", () => {


    it("PUT - Create Attendance Record", () => {
        cy.fixture('postDataV1').then((data) => {
            const requestBody = data.bodyAttendance2
            cy.putApiV15(requestBody, url).then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.body.Message).to.equal("A field/format or business rule validation error has occurred.")
            })
        })
    })

})
