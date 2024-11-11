import { CatalogTerms } from './Terms Mappings/CatalogTerms'
import { CoursePlayerTerms } from './Terms Mappings/CoursePlayerTerms'

export default new class LanguageHelper{

    getTerms(languageAbbreviation){

         cy.request('/api/rest/v2/terms/' + languageAbbreviation).then((response) => {
			expect(response).property('status').to.equal(200)
            expect(response.body).to.have.property('terms')
            cy.wrap(response.body.terms).as('terms')
        })
        
        return cy.get('@terms').then((elements) => {
            return elements
        })
    }

    mapCatalogTerms(terms){
        const termsDictionary = Object.fromEntries(terms.map(x => [x.id, x.value]))

        let catalogKeys = new CatalogTerms();
        catalogKeys.ChooseView = termsDictionary['ChooseView'];
        catalogKeys.CalendarView = termsDictionary['CalendarView'];
        catalogKeys.CardView = termsDictionary['CardView'];
        catalogKeys.DetailView = termsDictionary['DetailView'];
        catalogKeys.ListView = termsDictionary['ListView'];
        catalogKeys.CourseOptions = termsDictionary['CourseOptions'];
        catalogKeys.PinnedSuccessfully = termsDictionary['PinnedSuccessfully'];
        catalogKeys.UnpinnedSuccessfully = termsDictionary['UnpinnedSuccessfully'];

        return catalogKeys;
    }


    getTerms(languageAbbreviation){

        cy.request('/api/rest/v2/terms/' + languageAbbreviation).then((response) => {
           expect(response).property('status').to.equal(200)
           expect(response.body).to.have.property('terms')
           cy.wrap(response.body.terms).as('terms')
       })
       
       return cy.get('@terms').then((elements) => {
           return elements
       })
   }

    mapCoursePlayerTerms(terms){
       const termsDictionary = Object.fromEntries(terms.map(x => [x.id, x.value]))

       let courseplayerKeys = new CoursePlayerTerms();
       courseplayerKeys.Courses = termsDictionary['Courses']
       courseplayerKeys.Object = termsDictionary['Object']
       courseplayerKeys.AddOnlineCourseButton = termsDictionary['AddOnlineCourseButton']
       courseplayerKeys.AddLearningObjectButton = termsDictionary['AddLearningObjectButton']

    return courseplayerKeys;

    }






}


