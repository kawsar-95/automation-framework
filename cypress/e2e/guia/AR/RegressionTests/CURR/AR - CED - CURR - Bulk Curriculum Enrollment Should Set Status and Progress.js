import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

// bulk curriculum enrollment needs at least 10+ users for it to happen
const userNames = [
    userDetails.username, 
    userDetails.username2, 
    userDetails.username3,
    userDetails.username4, 
    userDetails.username5, 
    userDetails.username6, 
    userDetails.username7,
    userDetails.username8,
    userDetails.username9,
    userDetails.username10,
    userDetails.username11,
    userDetails.username12
]

var i = 0;
let featureFlag;
let clientToggle;

describe('MT-11011 - Bulk Curriculam Enrollment When A Group Has Minimum Courses Set to Zero Should Set Learner Status To In Progress', () => {
    before(() => {
        // Login as admin/ Blatant admin.
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.viewport(1600, 1000)  // make screen a little larger so I can see!!!
        ARDashboardPage.getMediumWait()

        // Go to feature flags
        cy.visit('admin/featureflags')
        ARDashboardPage.getShortWait()
        // check if EnableBulkCurriculumEnrollmentOrchestration is enabled
        // cy.get(`label:contains("EnableBulkCourseBundleEnrollmentOrchestration")`).parent().find('[data-bind*="click: ToggleChecked"]').should('have.class', 'toggle on')
        
        // enable feature flag EnableBulkCurriculumEnrollmentOrchestration 
        cy.get(`label:contains("EnableBulkCourseBundleEnrollmentOrchestration")`).parent().within(() => {
            // save the original state of the toggle to be restored at the end of the test fixture
            cy.get('[data-bind*="click: ToggleChecked"]').invoke('prop', 'className').then(state => {
                cy.log('FF toggle: ' + state)
                featureFlag = state;
            })
            cy.get('[data-bind*="click: ToggleChecked"]').click({force:true})
            ARDashboardPage.getShortWait()
        })
        cy.get('[data-menu="Sidebar"]').contains("Save").click()
        ARDashboardPage.getMediumWait()

        // Go to Portal Settings
        cy.get(ARDashboardAccountMenu.getA5AccountSettingsBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get('[class*="btn success large has-icon"]').contains('Portal Settings').click()
        ARDashboardPage.getShortWait()
        
        // Asserting Client Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        
        // check if IsSynchronousCurriculumEnrollmentsEnabled is enabled
        // cy.get(`[id="ClientServices.IsSynchronousCurriculumEnrollmentsEnabled"]`).find("a").should("have.class", "toggle on")

        // enabled client toggle setting IsSynchronousCurriculumEnrollmentsEnabled
        cy.get(`[id="ClientServices.IsSynchronousCurriculumEnrollmentsEnabled"]`).parent().within(() => {
            // save the original state of the toggle to be restored at the end of the test fixture
            cy.get('[data-bind*="click: ToggleChecked"]').invoke('prop', 'className').then(state => {
                cy.log('Client toggle: ' + state)
                clientToggle = state;
            })
            cy.get('[data-bind*="click: ToggleChecked"]').click({force:true})
            ARDashboardPage.getShortWait()
        })        
        cy.get('[data-menu="Sidebar"]').contains("Save").click()
        ARDashboardPage.getMediumWait()

        // create users
        for (i = 0; i < userNames.length; i++) {
            cy.log('User : ' + userNames[i])
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
            ARDashboardPage.getShortWait()
        }
    })
    beforeEach(() => {
        cy.wrap(featureFlag).as('featureFlag')
        cy.wrap(clientToggle).as('clientToggle')

        // Login as admin/ Blatant admin.
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.viewport(1600, 1000)  // make screen a little larger so I can see!!!
        ARDashboardPage.getLShortWait()

        //Navigate to Course
        ARDashboardPage.getCoursesReport()
    })
    after(() => {
        // Login as admin/ Blatant admin.
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.viewport(1600, 1000)  // make screen a little larger so I can see!!!
        ARDashboardPage.getMediumWait()

        // restore feature flag to original state
        cy.get('@featureFlag').then((previousState) => {
            cy.log('Previous FF toggle: ' + previousState)
            // Go to feature flags
            ARDashboardPage.getMediumWait()
            cy.visit('admin/featureflags')
            ARDashboardPage.getShortWait()
            cy.get(`label:contains("EnableBulkCourseBundleEnrollmentOrchestration")`).parent().within(() => {
                cy.get('[data-bind*="click: ToggleChecked"]').invoke('prop', 'className').then(currentState => {
                    cy.log('Current FF toggle: ' + currentState)
                    if (currentState !== previousState){
                        cy.get('[data-bind*="click: ToggleChecked"]').click()
                    }
                })
            })
            cy.get('[data-menu="Sidebar"]').contains("Save").click()
            ARDashboardPage.getMediumWait()
        })

        // restore client toggle to original state
        cy.get('@clientToggle').then((previousState) => {
            cy.log('Previous client toggle: ' + previousState)
            // Navigate to Portal Settings
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardAccountMenu.getA5AccountSettingsBtn()).click()
            ARDashboardPage.getShortWait()
            cy.get('[class*="btn success large has-icon"]').contains('Portal Settings').click()
            ARDashboardPage.getShortWait()
            // Asserting Client Page
            cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
            // enabled client toggle setting IsSynchronousCurriculumEnrollmentsEnabled
            cy.get(`[id="ClientServices.IsSynchronousCurriculumEnrollmentsEnabled"]`).parent().within(() => {
                cy.get('[data-bind*="click: ToggleChecked"]').invoke('prop', 'className').then(currentState => {
                    cy.log('Client toggle: ' + currentState)
                    if (currentState !== previousState){
                        cy.get('[data-bind*="click: ToggleChecked"]').click()
                    }
                })
            })
            cy.get('[data-menu="Sidebar"]').contains("Save").click()
            ARDashboardPage.getMediumWait()
        });

        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')        
    })

    it('Create Curriculam Course', () => {
        // Click on Add Curriculum from right panel. Fill values in all required fields and toggle on status to active.
        cy.createCourse('Curriculum')
        
        // Select courses from the pop-up and click on choose button.
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
        ARSelectModal.getShortWait()

        // Select "Must complete all" option 
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute('radio-button')).contains('Must complete all').click({ force: true })
        ARSelectModal.getShortWait()

        // Add another group
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute('add-curriculum-group')).click()
        ARDashboardPage.getShortWait()

        // Add courses to the new group
        cy.get(ARCURRAddEditPage.getGroupList())
            .contains(currDetails.defaultGroupName2)
            .parents(ARCURRAddEditPage.getElementByDataNameAttribute('curriculum-group')).within(() => {
                // Select "Minimum courses" option 
                cy.get(ARCURRAddEditPage.getElementByDataNameAttribute('radio-button')).contains('Minimum courses').click({ force: true })
                cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Required Course Count')).clear().type('0')
                ARSelectModal.getShortWait()
                cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
            })
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_03_name, courses.oc_filter_04_ojt])
        ARSelectModal.getShortWait()

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        ARDashboardPage.getMediumWait()
        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], userNames)
    })
    //This it block is commented out due to environmental issues 
    // it('View enrollments', () => {
    //     // Find curriculum
    //     ARDashboardPage.AddFilter('Name', 'Contains', currDetails.courseName)
    //     ARDashboardPage.getLShortWait()

    //     // Select the curriculum
    //     cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    //     ARDashboardPage.getLShortWait()
        
    //     // Click on Course Enrollments
    //     cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()
    //     ARDashboardPage.getShortWait()
    //     cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10*1000}).should('not.exist')
    //     ARDashboardPage.getMediumWait()

    //     // Verify all enrolled users have correct status and progress
    //     for (i = 0; i < userNames.length; i++) {
    //         cy.log(`Iteration - ${i + 1}`)
    //         cy.get(AREnrollUsersPage.getTableCellRecord()).contains(userNames[i]).parent().within(() => {
    //             cy.get('td').eq(5).should('have.text', '0')
    //             cy.get('td').eq(6).should('have.text', 'In progress')
    //         }).click()
    //     }
    // })

    it('Delete users', () => {
        //Delete Users
        ARDashboardPage.deleteUsers(userNames)
    })
})