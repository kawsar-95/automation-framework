import { users } from "../../../../../../../helpers/TestData/users/users";


let customFieldID;

describe("Custom Fields Test", () => {
    it("GET - Get Custom Fields", () => {


        cy.getApiSFV2("/admin/users/" + users.learner01.learner01UserID + "/custom-fields", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            customFieldID = response.body.customFields[0].id
            


        })
    })

    it("PUT - Save custom field values", () => {

        cy.fixture('postDataPartnerApi').then((data) => {
            const requestBody = data.bodyCustomFields
            cy.putApiPartnerV2("/admin/users/" + users.learner01.learner01UserID + "/custom-fields", null, requestBody).then((response) => {
                expect(response.status).to.be.eq(200)
                expect(response.duration).to.be.below(3000)
               // expect(response.body.customFields[0].id).to.equal(customFieldID)


            })//Needs work in 2nd it block. Check the permissions of Sys Admin 
        })
    })
})