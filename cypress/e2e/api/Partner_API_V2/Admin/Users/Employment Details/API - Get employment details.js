import { users } from "../../../../../../../helpers/TestData/users/users";


let supervisorID;;

describe("Employment Details Test", () => {

    it("GET - Get Employment Details", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/employment-details", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body._links.userProfile.href).to.include(users.learner01.learner01UserID)
            supervisorID = response.body.supervisorId


        })
    })
})