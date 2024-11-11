export default new class ARUpdateScriptPage{

    //Get deleted by user
    getDeletedByUserId(objectId, objectType){
        cy.contains('Get deleted by user id').parent().find('form').within(() =>{
            cy.get('input[name=clientId]').type(Cypress.env('client_ID'))
            cy.get('input[name=objectId]').type(objectId)
            cy.get(`input[value="${objectType}"]`).click()
            cy.get('input[value="Get User Id"]').click()
    })}
    
    //Get url
    getUpdateScriptUrlExtension(){
        return '/admin/updatescript'
    }
}