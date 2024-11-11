import { users } from "../../../../../helpers/TestData/users/users"


describe("Public Profile Test", () => {

    it("GET - My Learner profile", () => {
        cy.getApiSFV2("/my-profile", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.username).to.equal(users.sysAdmin.admin_sys_01_username)
        })
    })
    


})