import { users } from "../../../../../../helpers/TestData/users/users";

let queryParams = {
    key: ''
}
let userKeyID;

describe("API -  User Test", () => {
    it("GET -  List users.", () => {
        cy.getApiV15("/users", queryParams ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            userKeyID = response.body.users[0].id
        })
    })
})