import { users } from "../../../../../helpers/TestData/users/users";






let url = "instructor-led-course-sessions/{sessionId}/session-schedules/{sessionScheduleId}/attendance/{id}"
    describe( "Authentication Test", () => {
       

        it("PUT - Create Attendance Record", () => {
            cy.fixture('postDataV15').then((data) => {
                const requestBody = data.bodyAttendance2
            cy.putApiV15(requestBody, url).then((response) => {
                expect(response.status).to.be.eq(422)
                expect(response.body.message).to.include("Invalid format provided for id")
            })
           })
         })

    })

