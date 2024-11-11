import createBasePage from "../../CreateBasePage"


export default new class CreateDashboardPage extends createBasePage {
    
    
    getCongratulations(){
        return `[data-name="create-course-onboarding-continue-button"]` 
    }

    getCongratulationsLegacy(){
        return `[data-name="continue-button"]` 
    }

    getCongratulationstxt(){
        return "Continue"
    }

    
}