import { users } from "../../../../../../helpers/TestData/users/users";


describe("API - Enrollment Credits Test", () => {
    it("GET - List credits from a specific user's course enrollment.", () => {
        cy.getApiV15("/credits/users/" + users.learner01.learner01UserID + "/enrollments/" + users.learner01.learner01_enrollment_id, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].creditTypeName).to.eq("General")
            
       })
    })
    })

