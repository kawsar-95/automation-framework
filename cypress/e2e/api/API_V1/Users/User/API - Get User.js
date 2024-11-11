import { users } from "../../../../../../helpers/TestData/users/users";


describe("API -  User Test", () => {
    it("GET - User.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.equal(users.learner01.learner01UserID)
        })
    })
})