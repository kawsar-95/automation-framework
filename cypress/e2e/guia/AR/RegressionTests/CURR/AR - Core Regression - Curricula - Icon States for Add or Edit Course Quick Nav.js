import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'

describe('C7319 - AUT-697 - AR - Core Regression - Curricula - Icon States for Add Course Quick Nav (cloned)', () => {
    after('Delete the created courses added for the test', () => {
        let i = 0
        for (; i < commonDetails.courseIDs.length; i++) {
            let course = commonDetails.courseIDs[i]
            if (course.type === null) {
                cy.deleteCourse(course.id)
            } else {
                cy.deleteCourse(course.id, course.type)
            }
        }
    })

    it('Click on Add Curriculum from Right navigation bar', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")        
        ARDashboardPage.getCoursesReport()
        // Create curriculum course  
        cy.createCourse('Curriculum')
        // Assert add curriculum page should get open.
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()
        // Assert General button section is expanded - top and bottom section icons have dots
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('General')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Assert Courses button section is expanded - top and bottom section icons have dots
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Courses')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Assert Hidden Messages button section disable top and bottom section icons have dots
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Delete group confirmation pop-up should get open.
        cy.get(ARCURRAddEditPage.getGroupDeleteBtn(1)).click()
        // Click on Delete button.
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARCURRAddEditPage.getShortWait()
        // Asserting Syllabus icons (top and bottom) don't display.
        cy.get(arAddMoreCourseSettingsModule.getExpandCourseSettingByNameBtn('Syllabus')).should('not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Click on Add group button.
        cy.get(ARCURRAddEditPage.getAddCurriculumGroupBtn()).first().click()
        ARCURRAddEditPage.getLShortWait()  
        // Click on Add courses button.
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).should('be.visible')
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).click()
        // Assert Select Courses pop-up should get open.
        ARSelectModal.SearchAndSelectFunction([courses.curr_filter_01_oc_child_01])
        AREnrollmentKeyPage.getLShortWait()    
        // Assert Courses should get added and Dot on syllabus icon (top and bottom) continues to display.
        cy.get(arAddMoreCourseSettingsModule.getExpandCourseSettingByNameBtn('Syllabus')).should('not.exist')
        AREnrollmentKeyPage.getLShortWait()   
        // Click on Add Group button.
        cy.get(ARCURRAddEditPage.getAddCurriculumGroupBtn()).first().click()
        ARCURRAddEditPage.getLShortWait()  
        // Assert New Group should get added and dot on courses section continues to display(top and bottom).
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCURRAddEditPage.getGroupTitleTxtF())).last().should('have.value', "Group 2")
        ARCURRAddEditPage.getLShortWait()  
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).last().click()
        ARSelectModal.SearchAndSelectFunction([courses.cb_filter_01_name])
        AREnrollmentKeyPage.getLShortWait()
        // Click on Delete icon beside selected course.
        ARCURRAddEditPage.getDeleteGroupCourse()
        AREnrollmentKeyPage.getLShortWait()
        // Click on Remove button on confirmation pop-up.
        ARCURRAddEditPage.getRemoveGroupCourse()
        // Repeat step 9 & 10 to add multiple courses
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).last().click()
        ARSelectModal.SearchAndSelectFunction([courses.ilc_ecomm_01_name])
        AREnrollmentKeyPage.getLShortWait()  

        ARCURRAddEditPage.getDeleteGroupCourse()
        AREnrollmentKeyPage.getLShortWait()
        ARCURRAddEditPage.getRemoveGroupCourse()
        // Double click on enrollment rules icon from top section.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
        arAddMoreCourseSettingsModule.getLShortWait()  
        // Assert Enrollment rules section should get open
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).should('exist')
        // Select Course Editor radio button in approval section.
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).within(() => {
            arAddMoreCourseSettingsModule.getCourseApprovalSetting()
        })
        // Asserting Dot on Enrollment section icon on top and bottom should start displaying.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        // Agaien Double click on enrollment rules icon from top section.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
        // Agaien Select Course Editor radio button in approval section.
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).should('exist')
        // Select Course Editor radio button in approval section.
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).within(() => {
            arAddMoreCourseSettingsModule.getCourseApprovalSetting()
        })
        // Asserting The top and bottom section icons display dots where elements have had their values updated.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        // Again select None radio button in approval for enrollment rules section.
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).within(() => {
            arAddMoreCourseSettingsModule.getCourseApprovalNoneSetting()
        })
        // Asserting Dot on enrollment rules section should get removed.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Select specific radio button in Allow Self Enrollment for enrollment rules section.
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        // Asserting displays an error message and Icons with errors turn on in red.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getRedErrorIcon(),'exist')
        // Click in users drop down section
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).within(() => {
            arAddMoreCourseSettingsModule.getEnrollmentSelectionCourseName()
        })
        arAddMoreCourseSettingsModule.getLShortWait()
        // Asserting The error should get removed and dot on enrollment rules section in top and bottom should turn in blue.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        ARCURRAddEditPage.getLShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Adding a new Curriculum when the there is a default thumbnail set in the client', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")        
        ARDashboardPage.getCoursesReport()

        // Added curriculum course  
        cy.createCourse('Curriculum')
        // Assert add curriculum page should get open.
        ARSelectModal.SearchAndSelectFunction([courses.oc_01_mandatory_name])
        ARSelectModal.getLShortWait()
        // Assert General button section is expanded - top and bottom section icons have dots
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('General')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Assert Courses button section is expanded - top and bottom section icons have dots
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Courses')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        // Assert Hidden Messages button section disable top and bottom section icons have dots
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        arAddMoreCourseSettingsModule.getLShortWait()
    })

    it('Adding a new Curriculum as a department admin with no Enroll Anyone permission', () => {
        // Sign into admin side as department admin
        cy.apiLoginWithSession(users.depAdminSUBDEP.admin_dep_username, users.depAdminSUBDEP.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        // Adding a new Curriculum
        cy.createCourse('Curriculum')
        ARDashboardPage.getShortWait()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()
        // locked department is enabled in the client
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_E_name])
        // Enrollment Anyone permission 
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Assert General (blue and the section is expanded)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('General')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        // Assert Courses (blue and the section is expanded)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Courses')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        // Assert Hidden Messages button section 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        // Assert Enrollment Rules (red and the section is expanded)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        // Assert Course Administrators (blue and the section is expanded)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        arAddMoreCourseSettingsModule.getLShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Add and save a Curriculam course to edit later', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")        
        ARDashboardPage.getCoursesReport()

        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Curriculum')).should('have.text', 'Add Curriculum').click()
        

        ARCURRAddEditPage.WaitForElementStateToChange(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCURRAddEditPage.getGeneralTitleTxtF()))
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCURRAddEditPage.getGeneralTitleTxtF())).invoke('val', currDetails.courseName.slice(0, -1)).type(currDetails.courseName.slice(-1))
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).type(currDetails.description)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Editing an existing Curriculum', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")        
        ARDashboardPage.getCoursesReport() 

        // Edit curriculum page should get open.
        arAddMoreCourseSettingsModule.AddFilter('Name', 'Contains', currDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click({force:true})
        ARDashboardPage.getMediumWait()
        cy.get(arAddMoreCourseSettingsModule.getAddEditMenuActionsByName('Edit')).click({ force: true })
        cy.get(ARCURRAddEditPage.getAddGroupBtn()).should('be.visible').click()
        ARDashboardPage.getMediumWait()
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        ARDashboardPage.getShortWait()
        // locked department is enabled in the client
        cy.get(ARCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_E_name])
        // Asserty Icons of expanded sections are blue
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('General')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Courses')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'exist')
        // Assert icons of hidden sections are grey.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).should('have.class', ARCURRAddEditPage.getDotSymbol(), 'not.exist')
        // Triggering errors in each section. Repeat step 21 in case of edit curriculum.
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        // Assert Icons with errors turn red.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).should('have.class', ARCURRAddEditPage.getRedErrorIcon(),'exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
        arAddMoreCourseSettingsModule.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        // Fixing errors in a section
        cy.get(arAddMoreCourseSettingsModule.getCurriculumSection()).within(() => {
            arAddMoreCourseSettingsModule.getEnrollmentSelectionCourseName()
        })
        arAddMoreCourseSettingsModule.getShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })
})