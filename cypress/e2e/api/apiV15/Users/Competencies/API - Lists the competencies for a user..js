import { users } from "../../../../../../helpers/TestData/users/users"


let competencyID;

describe("API -  Competencies Test", () => {
    it("GET - Lists the competencies for a user.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            competencyID = response.body.competencies[0].id
        })
    })
})