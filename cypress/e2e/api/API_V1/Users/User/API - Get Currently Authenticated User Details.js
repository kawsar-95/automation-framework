import { users } from "../../../../../../helpers/TestData/users/users";


describe("API -  User Test", () => {
    it("GET - Get currently authenticated User's details.", () => {
        cy.getApiV15("/mydetails", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Username).to.equal(users.sysAdmin.admin_sys_01_username)
        })
    })

})