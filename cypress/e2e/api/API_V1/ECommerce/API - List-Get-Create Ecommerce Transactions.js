import { users } from "../../../../../helpers/TestData/users/users";



let transactionID;
let queryParam = {
    userId: users.learner01.learner01UserID
}

describe("API - ECommerce Test", () => {
    it("GET - List e-commerce transactions.", () => {

        cy.getApiV15("/ecommerce/transactions", queryParam).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            transactionID = response.body[0].Id
        })
    })
    it("GET - Ecommerce transaction.", () => {

        cy.getApiV15("/ecommerce/transactions/" + transactionID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.eq(transactionID)
            expect(response.body).to.haveOwnProperty("Details")
        })
    })
    it("POST - Approves or denies an e-commerce transaction.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody = data.postEcommerce
            cy.postApiV15(requestBody, null, "/ecommerce/transactions/" + transactionID + "/status").then((response) => {
                expect(response.status).to.be.eq(409)
                expect(response.duration).to.be.below(500)
                expect(response.body.error.details).to.eq("Only Pending ShoppingCartTransactions can be approved or declined.")
            })
        })
    })

})
