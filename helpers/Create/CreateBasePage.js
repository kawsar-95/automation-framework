import basePage from '../BasePage';

//export default class ARBasePage extends basePage {

export default class CreateBasePage extends basePage {
   
    //Select Course Course Theme


    //Verify that theme modal appears
    getThemeTemplates(){
        return "Theme Templates"
    }


    getReviewTab(){
        return `[data-name="reviews-nav"]`
      }
 
      getReviewBtnValue(){
         return "Reviews"
     }
    
}