import createBasePage from "../../CreateBasePage"


export default new class CreateDashboardPage extends createBasePage {
    
    getUserBtn() {
        return `[data-name="account-menu"]` 
    }

    getLogoutBtn(){
       return `[data-name="sign-out-button"]`
    }

    getCreateBtn(){
          return `[data-name="create-button"]` 
    }

    getCreateBtnValue(){
        return "Create"
    }

    getReviewTab(){
       return `[data-name="reviews-nav"]`
     }

     getReviewBtnValue(){
        return "Reviews"
    }
    getUser(){
        return '[data-name="profile-full-name"]'

    }
}