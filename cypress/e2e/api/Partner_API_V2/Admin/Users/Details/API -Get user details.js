import { users } from "../../../../../../../helpers/TestData/users/users"


let notes;

describe("Details Test", () => {

    it("GET - Get User Details", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/details", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            notes = response.body.notes
            expect(response.body._links.user.href).to.include(users.learner01.learner01UserID)
            cy.log(JSON.stringify(response.body))


        })
    })
})