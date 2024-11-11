import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import ARCollaborationHistoryModal from '../../../../../../helpers/AR/pageObjects/Modals/ARCollaborationHistoryModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

//This test will need to be updated later to create/delete a collaboration once NLE-3136 has been completed
describe('AR - Collaborations - Availability Rules and History', function(){

    try {   
        //leaving this code in as it does work, however, the filtering of the course afterwards causes a browser error 
       /* before(() => {
            //Sign into admin side as sys admin, navigate to Collaborations
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaborations'))
            cy.intercept('/api/rest/v2/admin/reports/collaborations/operations').as('getCollaborations').wait('@getCollaborations')
            
            //Filter for Collaboration and Edit it
            cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', collaborationNames.L_COLLABORATION_NAME))
            cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationNames.L_COLLABORATION_NAME).click()
            cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration'), 1000))
            cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
            arDashboardPage.getMediumWait()
            
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).then(($u) => { 
                if ($u.text().includes('Learner')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedUser()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLShortWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedUser()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No users to delete")
                }
            })

            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).then(($g) => { 
                if ($g.text().includes('GROUP')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedGroup()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            cy.get(ARCollaborationAddEditPage.getSelectedGroup()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No groups to delete")
                }
            })

            cy.get(ARCollaborationAddEditPage.getDepartmentsContainer()).then(($d) => { 
                if ($d.text().includes('No departments')) {
                    cy.addContext("No groups to delete")
                } else {
                    cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).eq(0).within(() => {
                                cy.get(ARCollaborationAddEditPage.getDeleteDepartmentRuleBtn()).click()
                            })
                        }
                    })
                }
            })

            //Save Changes
            cy.get(arDashboardPage.getSaveBtn()).click()
            arDashboardPage.getShortWait()
            cy.logoutAdmin()
        })*/


        beforeEach(() => {
            //Sign into admin side as sys admin, navigate to Collaborations
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaborations'))
            cy.intercept('/api/rest/v2/admin/reports/collaborations/operations').as('getCollaborations').wait('@getCollaborations')
            //Filter for Collaboration and Edit it
            cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', collaborationNames.L_COLLABORATION_NAME))
            arDashboardPage.getLongWait()
            cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationNames.L_COLLABORATION_NAME).click()
            cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration'), 1000))
            cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
            arDashboardPage.getMediumWait()

        })

        it('Verify Availability Rules', () => {
            
            //clear fields first
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).then(($u) => { 
                if ($u.text().includes('Learner')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedUser()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLongWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedUser()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No users to delete")
                }
            })
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).then(($g) => { 
                arDashboardPage.getLongWait()
                if ($g.text().includes('GROUP')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedGroup()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLongWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedGroup()).eq(0).parent().within(() => {
                                arDashboardPage.getLongWait()
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No groups to delete")
                }
            })
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getDepartmentsContainer()).then(($d) => { 
                if ($d.text().includes('No departments')) {
                    cy.addContext("No groups to delete")
                } else {
                    cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).eq(0).within(() => {
                                cy.get(ARCollaborationAddEditPage.getDeleteDepartmentRuleBtn()).click()
                            })
                        }
                    })
                }
            })
            
            //Verify Multiple Users can be Selected from the List
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).click()
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersSearchTxtF()).type('GUIAutoL0')
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersOpt()).contains(collaborationDetails.l01Name).click()
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersOpt()).contains(collaborationDetails.l02Name).click()
            
            //Click other element to hide users dropdown menu
            cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationAddEditPage.getSectionHeader())).contains('Assignments').click()

            //Verify a Selected User can be Removed
            cy.get(ARCollaborationAddEditPage.getSelectedUser()).contains(collaborationDetails.l02Name).parent().within(() => {
                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
            })
    
            //Verify Multiple Groups can be Selected from the List
            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).click()
            cy.get(ARCollaborationAddEditPage.getGroupsSearchTxtF()).type('GUIA')
            arDashboardPage.getMediumWait()
            ARCollaborationAddEditPage.getGroupsOpt(users.groups.guia_group_name)
            arDashboardPage.getMediumWait()
            ARCollaborationAddEditPage.getGroupsOpt(users.groups.report_sharing_group_name)
            arDashboardPage.getMediumWait()
            cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationAddEditPage.getSectionHeader())).contains('Assignments').click()
            arDashboardPage.getMediumWait()
            
            //Verify a Selected Group can be Removed
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getSelectedGroup()).contains(users.groups.report_sharing_group_name).parent().within(() => {
                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
            })
    
            //Verify Multiple Departments can be Added
            cy.get(ARCollaborationAddEditPage.getAddDepartmentsBtn()).click()
            cy.get(ARSelectModal.getSelectOpt()).contains(departments.DEPT_TOP_NAME).click()
            cy.get(ARSelectModal.getChooseBtn()).click()
            cy.get(ARCollaborationAddEditPage.getAddDepartmentsBtn()).click()
            cy.get(ARSelectModal.getSearchTxtF()).type(departments.SUB_DEPT_A_NAME)
            cy.get(ARSelectModal.getSelectOpt()).contains(departments.SUB_DEPT_A_NAME).click()
            cy.get(ARSelectModal.getChooseBtn()).click()
    
            //Verify Rules can be set for a Department Added
            cy.get(ARCollaborationAddEditPage.getDepartmentRuleLabel()).contains(departments.SUB_DEPT_A_NAME)
                .parents(ARCollaborationAddEditPage.getDepartmentRuleContainer()).within(() => {
                    cy.get(ARCollaborationAddEditPage.getDepartmentRuleDDown()).click()
                    ARCollaborationAddEditPage.getDepartmentOpt('Include All Sub-Departments')
                })
    
            //Verify a Department can be Removed
            cy.get(ARCollaborationAddEditPage.getDepartmentRuleLabel()).contains(departments.SUB_DEPT_A_NAME)
                .parents(ARCollaborationAddEditPage.getDepartmentRuleContainer()).within(() => {
                    cy.get(ARCollaborationAddEditPage.getDeleteDepartmentRuleBtn()).click()
                })
    
            //Verify Canceling Does not Save Changes
            cy.get(arDashboardPage.getCancelBtn()).click()
            cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
            arDashboardPage.getShortWait()
        })
    
        it('Update Availability Rules', () => {

            //clear fields first
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).then(($u) => { 
                if ($u.text().includes('Learner')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedUser()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLongWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedUser()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No users to delete")
                }
            })
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).then(($g) => { 
                if ($g.text().includes('GROUP')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedGroup()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLongWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedGroup()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No groups to delete")
                }
            })
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getDepartmentsContainer()).then(($d) => { 
                if ($d.text().includes('No departments')) {
                    cy.addContext("No groups to delete")
                } else {
                    cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).eq(0).within(() => {
                                cy.get(ARCollaborationAddEditPage.getDeleteDepartmentRuleBtn()).click()
                            })
                        }
                    })
                }
            })


            //Add Users, 
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).click()
            cy.get(ARCollaborationAddEditPage.getUsersSearchTxtF()).type('GUIAutoL0')
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersOpt()).contains(collaborationDetails.l01Name).click()
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersOpt()).contains(collaborationDetails.l02Name).click()
            arDashboardPage.getMediumWait()
            cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationAddEditPage.getSectionHeader())).contains('Assignments').click()
           
            //Add Groups 
            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).click()
            cy.get(ARCollaborationAddEditPage.getGroupsSearchTxtF()).type('GUIA')
            ARCollaborationAddEditPage.getGroupsOpt(users.groups.guia_group_name)
            ARCollaborationAddEditPage.getGroupsOpt(users.groups.report_sharing_group_name)
            cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationAddEditPage.getSectionHeader())).contains('Assignments').click()
            
            //Add Department
            cy.get(ARCollaborationAddEditPage.getAddDepartmentsBtn()).click()
            arDashboardPage.getMediumWait()
            cy.get(ARSelectModal.getSelectOpt()).contains(departments.DEPT_TOP_NAME).click()
            arDashboardPage.getMediumWait()
            cy.get(ARSelectModal.getChooseBtn()).click()
    
            //Save Changes
            cy.get(arDashboardPage.getSaveBtn()).click()
            arDashboardPage.getShortWait()
        })
    
        it('Verify Changes Persist, Verify History', () => {
            //Assert Users Persisted
            arDashboardPage.getMediumWait()
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).should('contain', collaborationDetails.l01Name)
                .and('contain', collaborationDetails.l02Name)
    
            //Assert Groups Persisted
            arDashboardPage.getShortWait()
            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).should('contain', users.groups.guia_group_name)
            .and('contain', users.groups.report_sharing_group_name)
    
            //Assert Department Persisted
            cy.get(ARCollaborationAddEditPage.getDepartmentRuleLabel()).should('contain', departments.DEPT_TOP_NAME)
            
    
            /* This part of the test is commented out until NLE-3136 is completed

            //Verify History for the Changes can be Seen
            cy.get(ARCollaborationAddEditPage.getViewHistoryBtn()).click()
            cy.get(ARCollaborationHistoryModal.getHistoryContainer()).should('contain', `Added ${L01Name} to ${ARCollaborationHistoryModal.getUserAssign()}`)
                .and('contain', `Added ${L02Name} to ${ARCollaborationHistoryModal.getUserAssign()}`)
            cy.get(ARCollaborationHistoryModal.getHistoryContainer()).should('contain', `Added ${users.groups.GUIA_GROUP_NAME} to ${ARCollaborationHistoryModal.getGroupAssign()}`)
                .and('contain', `Added ${users.groups.REPORT_SHARING_GROUP_NAME} to ${ARCollaborationHistoryModal.getGroupAssign()}`)
            cy.get(ARCollaborationHistoryModal.getHistoryContainer()).should('contain', `Added ${departments.DEPT_TOP_NAME} to ${ARCollaborationHistoryModal.getDepartmentAssign()}`)
            */
        })
    } finally {
        it('Cleanup - Clear All Rules and Save', () => {
            //Ensure all fields load
            arDashboardPage.getLongWait()

            //Clear all Rules (if they exist) and Save
            cy.get(ARCollaborationAddEditPage.getUsersDDown()).then(($u) => { 
                if ($u.text().includes('Learner')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedUser()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLongWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedUser()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No users to delete")
                }
            })
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getGroupsDDown()).then(($g) => { 
                if ($g.text().includes('GROUP')) {
                    cy.get(ARCollaborationAddEditPage.getSelectedGroup()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            arDashboardPage.getLongWait()
                            cy.get(ARCollaborationAddEditPage.getSelectedGroup()).eq(0).parent().within(() => {
                                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                            })
                        }
                    })
                } else {
                    cy.addContext("No groups to delete")
                }
            })
            arDashboardPage.getLongWait()
            cy.get(ARCollaborationAddEditPage.getDepartmentsContainer()).then(($d) => { 
                if ($d.text().includes('No departments')) {
                    cy.addContext("No groups to delete")
                } else {
                    cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).its('length').then((length) => {
                        for (let i = 0; i < length; i++) {
                            cy.get(ARCollaborationAddEditPage.getDepartmentRuleContainer()).eq(0).within(() => {
                                cy.get(ARCollaborationAddEditPage.getDeleteDepartmentRuleBtn()).click()
                            })
                        }
                    })
                }
            })

            //Save Changes
            cy.get(arDashboardPage.getSaveBtn()).click()
            arDashboardPage.getShortWait()
        })
    }
})