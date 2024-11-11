import createBasePage from "../../CreateBasePage"


export default new class CreateDashboardPage extends createBasePage {
    
  
    getInviteOthers(){
        return `[class="css-yk9bxm"]` 
    }

    getInviteOthersWelcometxt(){
        return "Invite others to join your workspace"
    }


    getInviteEmail(){
        return `[class=" css-1su4hdo"]` 
    }

    getSendInviteBtn(){
    return `[data-name="send-invites-button"]`  
    }

    getSkipInviteBtn(){
    return `[data-name="skip-this-step-button"]`  
    }

    getSendInviteEmailtxt(){
    return "rbhaloo3@gmail.com"
    }
  
    getSendInviteMalformedEmailtxt(){
    return "rbhaloo3" 
    }



}