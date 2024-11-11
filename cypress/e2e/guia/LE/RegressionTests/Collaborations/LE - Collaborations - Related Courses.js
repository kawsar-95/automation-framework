import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECoursesCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LECoursesCollaboration.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let numCourses, quotient, remainder;
let courseList = [], courseListSorted = [], allCourses = [], allCoursesSorted = [];

describe('LE - Collaborations - Related Courses', function(){

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Sign in, navigate to Collaboration
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.B_COLLABORATION_NAME).click()
    })

    it('Verify List of Courses in Right Pane', () => { 
        //Verify Max of 5 Courses are Displayed in the Right Pane
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Related Courses').parents(LECollaborationPage.getSectionContainer())
            .within(() => {
                cy.get(LECollaborationPage.getSectionList()).should('have.length', 5)
                //Verify Courses are Sorted Alphabetically
                cy.get(LECollaborationPage.getCourseListItem()).invoke('text').then(($course) => {
                    courseList.push($course) //Get Each Course Name
                });
            })

        //Create New Array by Sorting Original Alphabetically
        //Compare Both Arrays to Verify Original is Sorted Alphabetically
        courseListSorted = courseList.sort()
        cy.get(courseListSorted).each(($span, i) => {
            expect($span).to.equal(courseList[i]);
        }); 

        //Verify a Course in the List is Clickable and Launches Course Details
        cy.get(LECollaborationPage.getCourseListItem()).eq(1).invoke('text').then(($course) => {
            cy.get(LECollaborationPage.getCourseListItem()).contains($course).click()
            cy.get(LECoursesPage.getCourseTitleInBanner()).should('contain', $course)
        });
    })
    // This it block commentted out due to environmental issues.
    // it('Verify Courses Modal and Course Access', () => { 
    //     //Verify the Modal can be Opened and Dismissed with the view all button and Courses header
    //     cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllCoursesBtn())).click()
    //     cy.get(LECoursesCollaborationModal.getModalCloseBtn()).click()
    //     cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Related Courses').click()
    //     cy.get(LECoursesCollaborationModal.getModalCloseBtn()).click()

    //     //Verify Pill Shows Total Number of Related Courses
    //     cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Related Courses').parent().within(() => {
    //         cy.get(LECollaborationPage.getCountPill()).then(($numCourses) => {
    //             numCourses = parseInt($numCourses.text()) //Get total number of related courses
    //         })
    //     }).then(() => {
    //         remainder = numCourses % 10; //Find the remainder when total # courses is divided by 10
    //         //Get # of times we need to load courses in the modal
    //         if(remainder === 0) {
    //             quotient = Math.floor(numCourses/10) - 1;
    //         }
    //         else {
    //             quotient = Math.floor(numCourses/10);
    //         }
    //         //Verify View All Button Launches Related Courses Modal
    //         cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllCoursesBtn())).click()
        
    //         //Verify Modal Initially Only Displays 10 Courses
    //         cy.get(LECoursesCollaborationModal.getCourseContainer()).should('have.length', 10)
        
    //         //Verify All Courses can Be Loaded By Pressing the Load More Button
    //         //Loads 10 courses each time, so we use the quotient value found above
    //         for (let i = 0; i < quotient; i++) {
    //             cy.get(LECoursesCollaborationModal.getLoadMoreBtn()).click()
    //             LEDashboardPage.getVShortWait() 
    //         }
        
    //         //Verify All Courses have been Loaded in the Modal - Should Match Pill Value
    //         cy.get(LECoursesCollaborationModal.getCourseContainer()).should('have.length', numCourses)
        
    //         //Verify Courses are in Alphabetical Order
    //         cy.get(LECoursesCollaborationModal.getCourseName()).invoke('text').then(($course) => {
    //             allCourses.push($course) //Get Each Course Name
    //         });
        
    //         //Compare New Sorted Array with Original to Verify Members Modal is Sorted Alphabetically
    //         allCoursesSorted = allCourses.sort()
    //         cy.get(allCoursesSorted).each(($span, i) => {
    //             expect($span).to.equal(allCourses[i]);
    //         }); 

    //         //Verify a Course in the List is Clickable and Launches Course Details
    //         cy.get(LECoursesCollaborationModal.getCourseName()).eq(6).invoke('text').then(($course) => {
    //             let course = $course
    //             cy.get(LECoursesCollaborationModal.getCourseName()).contains($course).click()
    //             cy.get(LECoursesPage.getCourseTitleInBanner()).should('contain',`${course.slice(17)}`)
    //         });
    //         cy.go('back')

    //         //Verify Error Banner if Learner Clicks on Course they do not have Access to
    //         cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllCoursesBtn())).click()
    //         cy.get(LECoursesCollaborationModal.getCourseName()).contains(courses.curr_filter_01_oc_child_01).click()
    //         LECoursesPage.getCatalogCourseNotFoundErrorMsg()
    //     })  
    // })
})