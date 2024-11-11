import { users } from "../../../../../../helpers/TestData/users/users";


describe("API -  User Test", () => {
    it("GET - Get currently authenticated User's details.", () => {
        cy.getApiV15("/mydetails", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.username).to.equal(users.sysAdmin.admin_sys_01_username)
        })
    })

    it("GET - Get currently authenticated User's details.", () => {
        cy.getApiV15("/my-details", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.username).to.equal(users.sysAdmin.admin_sys_01_username)
        })
    })
})