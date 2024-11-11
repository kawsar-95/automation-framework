import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { departments } from  '../../../../../../helpers/TestData/Department/departments'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'

describe('C846 - GUIA-Story - NASA-2971 - Course Selection in a Course Bundle Makes use of the Category hierarchy Multi-Select (cloned)', function(){
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

    it('Add an active online course to be added in the course bundle', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course', ocDetails.courseName)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null});
        })
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
    })

    it('Add an inactive oline course to be added in the course bundle', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course', ocDetails.courseName2)
        // Make the course inactive
        arCBAddEditPage.generalToggleSwitch('false',ARUserAddEditPage.getIsActiveToggleContainer())
        // Assert that the course is now inactive
        arCBAddEditPage.generalToggleSwitch('false',ARUserAddEditPage.getIsActiveToggleContainer())
        
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null});
        })
    })

    it('Add an online course to be deleted to test later in the course bundle', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course', `${ocDetails.courseName}${arDashboardPage.getAppendText()}`)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null});
        })
    })

    it('Add a curriculum course to be added in the course bundle', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Curriculum', currDetails.courseName)
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        // Set enrollment rule - Allow self enrollment for all learners
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'curricula'});
        }) 
    })

    it('Verify course can be added in order and removal of course from the bundle', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()

        cy.createCourse('Course Bundle')
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName, `${ocDetails.courseName}${arDashboardPage.getAppendText()}`])
        ARSelectModal.getLShortWait()        
        
        // Assert that the course has been added into the bundle
        cy.get(arCoursesPage.getAddedCoursesInBundle()).each(($course, index) => {
            if (index === 0) {
                expect($course).to.contain(ocDetails.courseName)
            } else if (index === 1) {
                expect($course).to.contain(`${ocDetails.courseName}${arDashboardPage.getAppendText()}`)
            }
        })
        
        // Asset that the added course can be removed in two ways
        // Open add courses modal
        cy.get(arCoursesPage.getAddCoursesBtn()).click()
        arCoursesPage.getMediumWait()
        // Deslect the selected course again
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName, `${ocDetails.courseName}${arDashboardPage.getAppendText()}`])
        ARSelectModal.getMediumWait()

        // Assert that the course is not longer present into the bundle
        cy.get(arCoursesPage.getAddedCoursesInBundle()).should('not.exist')

        // Open add courses modal
        cy.get(arCoursesPage.getAddCoursesBtn()).click()
        arCoursesPage.getMediumWait()
        //Add add course to course bundle
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        ARSelectModal.getLShortWait()
        // Delete the course using the trash icon
        cy.get(arCoursesPage.getDeleteCourseBtn()).eq(0).click()
        arCoursesPage.getVShortWait()
        cy.get(arCoursesPage.getRemoveCourseBtnFromBundle()).click({force: true})
        // Assert that the course is not longer present into the bundle
        cy.get(arCoursesPage.getAddedCoursesInBundle()).should('not.exist')        
    })

    it('Verify adding inactive course', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle', cbDetails.courseName)
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName2])
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Assert that a department can be added to make it other admin access to the course bundle
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_C_name])
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Save the course bundle
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'course-bundles'});
        })
    })

    it('Verify adding deleted course ', () => {    
        // Delete the test course creasted earlier
        let course = commonDetails.courseIDs[2]
        cy.deleteCourse(course.id)
        // Create two sublist excluding the deleted one and merge (for clean-up)
        let preIds = commonDetails.courseIDs.slice(0, 2)
        let postIds = commonDetails.courseIDs.slice(3)
        commonDetails.courseIDs = preIds.concat(postIds)

        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        // Wait for the UI to be visible
      
        cy.createCourse('Course Bundle')
        //Add course to course bundle
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(`${ocDetails.courseName}${arDashboardPage.getAppendText()}`)
        cy.wait(1000)
        // Assert that the deleted course doesn't appear in the search
        cy.get(ARSelectModal.getFirstSelectOpt()).should('not.exist')
    })

    it('Verify adding a Curriculum course', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle')
        //Add course to course bundle
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(currDetails.courseName)
        cy.wait(1000)
        // Assert that the Curriculam course with doesn't appear in the search
        cy.get(ARSelectModal.getFirstSelectOpt()).should('not.exist')
    })

    it('Verify that the Department admin has the access right', () => {
        // Login as a different user from teh Top Level Department who has the access right 
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        arDashboardPage.getCoursesReport()
        // Search the new course bundle and edit
        arCoursesPage.getEditCourseByName(cbDetails.courseName)
        arCoursesPage.getLongWait()

        // Assert that the department admin has edit access and he's on that page
        cy.url().should('include', '/edit/')
    })
})