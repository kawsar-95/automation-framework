
let questionBankID;
let questionID;;

describe("API - Question Banks Test", () => {

    it("GET - List question banks.", () => {
        cy.getApiV15("/question-banks", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            questionBankID = response.body.questionBanks[0].id
        })
    })
    it("GET - Get question bank.", () => {
        cy.getApiV15("/question-banks/" + questionBankID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(questionBankID)
        })
    })
    it("POST - Get Refresh Token / Access Token", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody1 = data.bodyQuestionBank1
            cy.postApiV15(requestBody1, null, "/question-banks").then((response) => {
                expect(response.status).to.be.eq(409)
                expect(response.duration).to.be.below(2500)
                expect(response.body.message).to.equal("Question bank identifier 'd5a2252e-33c8-4947-affb-360bd32e0505' is invalid")
            })
        })
    })
    it("PUT - Update question bank.", () => {
        cy.fixture('postDataV15').then((data) => {
            const requestBody2 = data.bodyQuestionBank2
            cy.putApiV15(requestBody2, "/question-banks/d5a2252e-33c8-4947-affb-360bd32e0504").then((response) => {
                expect(response.status).to.be.eq(404)
                expect(response.duration).to.be.below(2500)
                expect(response.body.message).to.equal("QuestionBank with identifier d5a2252e-33c8-4947-affb-360bd32e0504 does not exist.")
            })
        })
    })
    it("GET - Get question bank.", () => {
        cy.getApiV15("/question-banks/" + questionBankID + "/questions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            questionID = response.body.questionBanks[0].id
        })
    })
    it("GET - Get question bank questions by Id", () => {
        cy.getApiV15("/question-banks/" + questionBankID + "/questions/" + questionID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(questionID)

        })
    })
})