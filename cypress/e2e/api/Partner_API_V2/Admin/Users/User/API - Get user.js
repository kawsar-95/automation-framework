import { users } from "../../../../../../../helpers/TestData/users/users";


let departmentID;
let userID;

describe("Users Test", () => {
    it("GET - User", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.id).to.equal(users.learner01.learner01UserID)
            expect(response.body.username).to.equal("Learner01")
            departmentID = response.body.departmentId
            userID = response.body.id


        })
    })
})