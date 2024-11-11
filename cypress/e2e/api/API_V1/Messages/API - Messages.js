import { users } from "../../../../../helpers/TestData/users/users";



let messageID;

describe("API - Messages Test", () => {
    it("GET - List user messages.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/messages", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            messageID = response.body[0].Id
        })
    })
    it("GET - Get message.", () => {
        cy.getApiV15("/messages/" + messageID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.include(messageID)
        })
    })
    it("GET - List user received messages.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/messages/received", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body[0].Id).to.include(messageID)
        })
    })
    it("GET - List user sent messages.", () => {
        cy.getApiV15("/users/" + users.learner01.learner01UserID + "/messages/sent", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(5000)
        })
    })
})