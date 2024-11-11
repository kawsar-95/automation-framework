import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARLearnerCompetenciesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage"
import ARUserEnrollmentPage from "../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C733 - Filter - Enum', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('User Report Status', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to user 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        //add status to table's column
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')).find('span').contains('Status').click()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
        //Apply Filter status = Active
        ARDashboardPage.AddFilter('Status', 'Active')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'Active')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        ARDashboardPage.getMediumWait()
        //Apply Filter status = Inactive
        ARDashboardPage.AddFilter('Status', 'Inactive')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'Inactive')
        })

    })
    it('Course Report Type', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses")
        let i = 0
        let types = ['Course Bundle', 'Curriculum', 'Instructor Led Course', 'Online Course']
        for (i = 0; i < types.length; i++) {
            const type = types[i]
            ARDashboardPage.AddFilter('Type', type)
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', type.replace(/\s+/g, ''))
            })
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
            ARDashboardPage.getMediumWait()
        }
    })
    it('Course Enrollment Status Filter', () => {
        // Navigate to course enrollments
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Enrollments'))
        ARDashboardPage.getMediumWait()
        // Filter Course
        ARCoursesPage.EnrollmentPageFilter(courses.oc_filter_01_name)
        ARDashboardPage.getMediumWait()
        let i = 0
        const statuses = ['Absent', 'Declined', 'Failed', 'In Progress', 'N/A', 'Not Complete', 'Not Started', 'On waitlist', 'Pending Approval', 'Pending Evaluation Required', 'Pending Proctor']
        for (i = 0; i < statuses.length; i++) {
            const status = statuses[i]
            //Filter status
            ARDashboardPage.AddFilter('Status', status)
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', status == 'N/A' ? 'NotApplicable' : (status == 'On waitlist') ? 'OnWaitlist' : status.replace(/\s+/g, ''))
            })
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
            ARDashboardPage.getMediumWait()
        }

    })
    it('Venues Type Filter', () => {
        // Navigate to venues
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Venues'))

        ARDashboardPage.getMediumWait()

        let i = 0
        const types = ['Classroom', 'Connect Pro', 'GoToMeeting', 'Teams Meeting', 'WebEx', 'Webex Meeting', 'Zoom Meeting', 'Zoom Webinar']
        for (i = 0; i < types.length; i++) {
            const type = types[i]
            ARDashboardPage.AddFilter('Type', type)
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', type.replace(/\s+/g, ''))
            })
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
            ARDashboardPage.getMediumWait()
        }
    })
    it('Department Billing Type Filter', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to Departments
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Departments'))
        ARDashboardPage.getMediumWait()
        //add status to table's column
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')).find('span').contains('Billing Type').click()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
        let i = 0
        const billingTypes = ['Internal', 'NA']
        for (i = 0; i < billingTypes.length; i++) {
            const type = billingTypes[i]
            ARDashboardPage.AddFilter('Billing Type', type)
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', type)
            })
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
            ARDashboardPage.getMediumWait()
        }

    })
    it('User Enrollments Status filter', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to User Enrollments
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('User Enrollments'))
        ARDashboardPage.getMediumWait()
        ARUserEnrollmentPage.ChooseUserAddFilter(users.sysAdmin.admin_sys_01_username)
        ARDashboardPage.getMediumWait()
        let i = 0
        const statuses = ['Absent', 'Declined', 'Failed', 'In Progress', 'N/A', 'Not Complete', 'Not Started', 'On waitlist', 'Pending Approval', 'Pending Evaluation Required', 'Pending Proctor']
        for (i = 0; i < statuses.length; i++) {
            const status = statuses[i]
            //Filter status
            ARDashboardPage.AddFilter('Status', status)
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', status == 'N/A' ? 'NotApplicable' : (status == 'On waitlist') ? 'OnWaitlist' : status.replace(/\s+/g, ''))
            })
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
            ARDashboardPage.getMediumWait()
        }

    })
    it('Learner Competencies Status filter', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to Learner Competencies
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Learner Competencies'))
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        cy.get(ARDashboardPage.getListItem()).contains('Status').click()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })

        // Filter Status = Active
        cy.get(ARDashboardPage.getA5AddFilterBtn()).click()
        cy.get(ARDashboardPage.getA5PropertyNameDDown()).select('Status')
        cy.get(ARDashboardPage.getA5ValueDDown()).select('Active')
        cy.get(ARDashboardPage.getA5SubmitAddFilterBtn()).click()

        cy.get(ARLearnerCompetenciesReportPage.getFilterItemInfo()).should('contain', 'Active')
        cy.get(ARDashboardPage.getElementByTitleAttribute('Remove All')).click()

        // Filter Status = Inactive
        cy.get(ARDashboardPage.getA5AddFilterBtn()).click()
        cy.get(ARDashboardPage.getA5PropertyNameDDown()).select('Status')
        cy.get(ARDashboardPage.getA5ValueDDown()).select('Inactive')
        cy.get(ARDashboardPage.getA5SubmitAddFilterBtn()).click()

        cy.get(ARLearnerCompetenciesReportPage.getFilterItemInfo()).should('contain', 'Inactive')
    })
    it('Message Templates Type filter', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to Message Templates
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Message Templates'))
        ARDashboardPage.getMediumWait()

        let i = 0
        let types = ['Absorb Create Invite to Review', 'Absorb Create Mention', 'Approval Denied', 'Approval Pending', 'Approval Request']
        for (i = 0; i < types.length; i++) {
            const type = types[i]
            ARDashboardPage.AddFilter('Type', type)
            ARDashboardPage.getMediumWait()
            cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', type.replace(/\s+/g, '').substring(0, 18))
            })
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
            ARDashboardPage.getMediumWait()
        }
    })

})