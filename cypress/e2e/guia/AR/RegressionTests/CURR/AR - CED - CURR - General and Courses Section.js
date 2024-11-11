import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseDetailsCurrModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - Curriculum - Courses Section', function(){ 

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
    })

    it('Create Curriculum, Add Courses, New Group, Turn on Pace Progress, & Publish Course', () => {
        //Create curriculum
        cy.createCourse('Curriculum')
        //Add courses to curriculum - verify multiple courses are added in the order they are selected
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])

        //Verify courses were added in correct order
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 1 of 2'),{timeout: 10000}).should('contain', courses.oc_filter_01_name)
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 2 of 2')).should('contain', courses.oc_filter_02_name)

        //Add a second group with courses
        cy.get(ARCURRAddEditPage.getAddGroupBtn()).click()
        cy.get(ARCURRAddEditPage.getGroupTitle(), {timeout:10000}).should('contain', currDetails.defaultGroupName2)
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName2).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
        })
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_05_name, courses.oc_filter_03_name])
        
        //Turn ON Pace Progress toggle
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCURRAddEditPage.getPaceProgressToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled()).click()
        
        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Curriculum, Verify Description, Language, Courses and Groups, Re-order Courses, Delete Course from Group 1 & Publish Course', () => {
        //Edit course
        cy.editCourse(currDetails.courseName)

        //Verify Description persisted
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).clear()

        //Verify Description does not allow >4000 chars
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).invoke('text', arDashboardPage.getLongString(4000)).type('a')
        cy.get(ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.char_4000_error)
        
        //Remove description
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).clear()

        //Verify Language and edit it
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDown()).should('contain', currDetails.language).click()
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDownOpt()).contains('English').click()

        //Verify Pace Progress toggle is ON
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCURRAddEditPage.getPaceProgressToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        
        //Delete second course in group 1
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).parents(ARCURRAddEditPage.getCourseContainer()).within(() => {
                cy.get(ARCURRAddEditPage.getCourseDeleteBtn()).click()
            })
        })
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), {timeout:10000}).should('not.exist')

        //Verify courses can be re-ordered in group 2
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName2).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_03_name).parents(ARCURRAddEditPage.getCourseContainer()).within(() => {
                cy.get(ARCURRAddEditPage.getGripBtn()).focus().type(' ').type('{uparrow}').type(' ')
            })
        })

        //Publish Curriculum
        cy.publishCourse()
    }) 

    it('Edit Curriculum, Verify Courses were Re-ordered in Group 2 and Deleted in Group 1, Delete Language', () => {
        //Edit course
        cy.editCourse(currDetails.courseName)

        //Verify description was removed
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).should('contain.text', '')

        //Remove Language
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDown()).should('contain', 'English')
        cy.get(ARCURRAddEditPage.getGeneralLanguageClearBtn()).click()
        
        //Verify courses in group 2 were re-ordered correctly
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName2).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getCourseName()).eq(1).should('contain', courses.oc_filter_05_name)
            cy.get(ARCURRAddEditPage.getCourseName()).eq(0).should('contain', courses.oc_filter_03_name)
        })

        //Verify courses in group 1 were deleted
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName2).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).should('not.exist')
        })
    })

    it('Enroll Learner in Curriculum', () => {
        //Enroll learner in curriculum
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })
})

describe('AR - CED - Curriculum - Courses Section - Verify Pace Progress in LE', function(){

    beforeEach(() => {
        //Sign into LE, go to curriculum
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
        LEDashboardPage.getMediumWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Second Group Cannot be Accessed until First Group is Completed', () => {
        //Verify group 2 is locked and cannot be started
        cy.get(LECourseDetailsCurrModule.getGroupName()).contains(currDetails.defaultGroupName2).parents(LECourseDetailsCurrModule.getCurrGroupContainer()).within(() => {
            cy.get(LECourseDetailsCurrModule.getLockedGroupIcon()).should('exist')
            cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_03_name).parents(LECourseDetailsCurrModule.getCourseContainer()).within(() => {
                cy.get(LECourseDetailsCurrModule.getCourseActionBtn()).should('have.attr', 'aria-disabled', 'true')
            })
        })

        //Verify second course was deleted from first group
        cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_02_name).should('not.exist')

        //Complete the first group
        LECourseDetailsCurrModule.getCurrCourseActionBtnThenClick(currDetails.defaultGroupName, courses.oc_filter_01_name, 'Enroll')
        cy.get(LECourseDetailsCurrModule.getToastNotificationMsg()).should("contain","You have been successfully enrolled.")
        cy.get(LECourseDetailsCurrModule.getGroupName()).contains(currDetails.defaultGroupName).parents(LECourseDetailsCurrModule.getCurrGroupContainer()).within(() => {
            cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_01_name).parents(LECourseDetailsCurrModule.getCourseContainer()).within(() => {
                cy.get(LECourseDetailsCurrModule.getCourseActionBtn(), {timeout:10000}).should('contain', 'Completed')
            })
        })
    })

    it('Verify Second Group is Now Available', () => {
        //Verify group 2 courses are now available
        cy.get(LECourseDetailsCurrModule.getGroupName()).contains(currDetails.defaultGroupName2).parents(LECourseDetailsCurrModule.getCurrGroupContainer()).within(() => {
            cy.get(LECourseDetailsCurrModule.getLockedGroupIcon()).should('not.exist')
            cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_03_name).parents(LECourseDetailsCurrModule.getCourseContainer()).within(() => {
                cy.get(LECourseDetailsCurrModule.getCourseActionBtn()).should('have.attr', 'aria-disabled', 'false').and('contain', 'Enroll').click()
                cy.get(LECourseDetailsCurrModule.getCourseActionBtn(), {timeout:10000}).should('contain', 'Completed')
            })
        })
    })
})