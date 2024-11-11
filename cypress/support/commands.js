/// <reference types="cypress" />
import arCBAddEditPage from '../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import arCoursesPage from '../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arCURRAddEditPage from '../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARDeleteModal from '../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arDashboardPage from '../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arLoginPage from '../../helpers/AR/pageObjects/Auth/ARLoginPage'
import arPublishModal from '../../helpers/AR/pageObjects/Modals/ARPublishModal'
import arILCAddEditPage from '../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arOCAddEditPage from '../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import createLoginPage from '../../helpers/Create/pageObjects/Auth/CreateLoginPage'
import createDashboardPage from '../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage'
import { ocDetails } from '../../helpers/TestData/Courses/oc'
import { ilcDetails } from '../../helpers/TestData/Courses/ilc'
import { cbDetails } from '../../helpers/TestData/Courses/cb'
import { currDetails } from '../../helpers/TestData/Courses/curr'
import defaultTestData from '../fixtures/defaultTestData.json'
import LEDashboardPage from '../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arAddMoreCourseSettingsModule from '../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import LELoginPage from '../../helpers/LE/pageObjects/Auth/LELoginPage'
import leDashboardAccountMenu from '../../helpers/LE/pageObjects/Menu/LEDashboardAccount.menu'
import reviewerLoginPage from '../../helpers/Reviewer/pageObjects/Pages/ReviewerLoginPage'
import users from '../fixtures/users.json'
import basePage from '../../helpers/BasePage'
import ARCouponsAddEditPage, { AddCouponsData, } from "../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage";
import ARDepartmentProgressReportPage from '../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage'


// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

import 'cypress-wait-until';
import 'cypress-file-upload';
import 'cypress-iframe';
import ARDashboardPage from '../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'


Cypress.Commands.add('addContext', (context) => {
    cy.once('test:after:run', (test) => addContext({ test }, context));
});

// Custom command to login to Admin Refresh
Cypress.Commands.add("loginAdmin", (username, password) => {
    cy.visit("/admin")
    cy.get(arLoginPage.getUsernameTxtF()).type(username)
    cy.get(arLoginPage.getPasswordTxtF()).type(password)
    cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
    cy.get(arLoginPage.getLoginBtn()).click()
    cy.intercept('**/client-sync-settings').as('getDashboard').wait('@getDashboard', { timeout: 60000 })
    arDashboardPage.getDismissAbsorbWalkmeBanner()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    
})

Cypress.Commands.add("adminLoginWithSession", (username, password) => {
    cy.session('AdminLogin', () => {
        cy.visit("/admin")
        cy.get(arLoginPage.getUsernameTxtF()).type(username)
        cy.get(arLoginPage.getPasswordTxtF()).type(password)
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        cy.intercept('**/client-sync-settings').as('getDashboard').wait('@getDashboard', { timeout: 60000 })
    })
    cy.visit('/admin')
    arDashboardPage.getDismissAbsorbWalkmeBanner()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
})
// POST Request for API V1.5
Cypress.Commands.add("postApiV15" , (requestBody, queryParams,  URL ) => {
   
    cy.apiAuthV15(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let  authToken = response.body;
      
      cy.request({
          method: "POST",
          url: URL ,
          qs: queryParams,
          body: requestBody,
          headers: {
              Authorization: `Bearer ${authToken}`,
              "x-api-key" : Cypress.env('absorb_api_key'),
          },
          failOnStatusCode: false
      })
  })
})

//GET Request for API V1.5

Cypress.Commands.add("getApiV15" ,  (url, queryParams = {}) => {
    cy.apiAuthV15(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let  authToken = response.body;
        cy.request({
            method: "GET",
            url: url ,
            qs : queryParams,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "x-api-key" : Cypress.env('absorb_api_key'),
            },
            failOnStatusCode: false
        })
    })

})
// PUT Request for API V1.5

Cypress.Commands.add("putApiV15", (requestBody, URL) => {
    cy.apiAuthV15(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let  authToken = response.body;
      
      cy.request({
          method: "PUT",
          url: URL ,
          body: requestBody,
          headers: {
              Authorization: `Bearer ${authToken}`,
              "x-api-key" : Cypress.env('absorb_api_key'),
          },
          failOnStatusCode: false
      })
  })
})
// Get Request with Querry params for API V1.5
Cypress.Commands.add("getWithParams", (url, queryParams = {}) => {
    cy.apiAuthV15(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let  authToken = response.body;
        cy.request({
            method: "GET",
            url: url ,
            qs : queryParams,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "x-api-key" : Cypress.env('absorb_api_key'),
            },
            failOnStatusCode: false
        })
    })
})
// POST request with query params
Cypress.Commands.add("postWithParams" , (requestBody,queryParams,  URL ) => {
   
    cy.apiAuthV15(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
      let  authToken = response.body;
    
    cy.request({
        method: "POST",
        url: URL ,
        qs: queryParams,
        body: requestBody,
        headers: {
            Authorization: `Bearer ${authToken}`,
            "x-api-key" : Cypress.env('absorb_api_key'),
        },
        failOnStatusCode: false
    })
})
})

//GET Request for API Rest V2

Cypress.Commands.add("getApiV2" ,  (url, queryParams = {}) => {
    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const authToken = response.body.token
        cy.request({
            method: "GET",
            url: url ,
            qs : queryParams,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "x-absorb-api-key" : Cypress.env('api_Key'),
            },
            failOnStatusCode: false
        })
    })

})

// POST Request for API Rest V2
Cypress.Commands.add("postApiV2" , (requestBody, queryParams,  URL ) => {
   
    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const  authToken = response.body.token;
      
      cy.request({
          method: "POST",
          url: URL ,
          qs: queryParams,
          body: requestBody,
          headers: {
              Authorization: `Bearer ${authToken}`,
              "x-absorb-api-key" : Cypress.env('api_Key'),
          },
          failOnStatusCode: false
      })
  })
})

//Custom command to delete a course for API Rest V2
Cypress.Commands.add("deleteCourseV2",  (URL) => {
    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const authToken = response.body.token
        cy.request({
            method: "DELETE",
            url: URL,
            headers: {
                Authorization: `Bearer ${authToken}`,
              "x-absorb-api-key" : Cypress.env('api_Key'),
            },
            failOnStatusCode: false
        })
    })
})

// PUT Request for API V1.5

Cypress.Commands.add("putApiV2", (requestBody,queryParams = {}, URL) => {
    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const authToken = response.body.token
      
      cy.request({
          method: "PUT",
          url: URL ,
          qs: queryParams,
          body: requestBody,
          headers: {
              Authorization: `Bearer ${authToken}`,
              "x-absorb-api-key" : Cypress.env('api_Key'),
          },
          failOnStatusCode: false
      })
  })
})

//DELETE Request for API Rest V2

Cypress.Commands.add("deleteApiV2" ,  (url, queryParams = {}) => {
    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const authToken = response.body.token
        cy.request({
            method: "DELETE",
            url: url ,
            qs : queryParams,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "x-absorb-api-key" : Cypress.env('api_Key'),
            },
            failOnStatusCode: false
        })
    })

})


//Custom command to logout from Admin Refresh
Cypress.Commands.add("logoutAdmin", () => {
    arDashboardPage.getShortWait()
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).should('be.visible').click({ force: true })
    //{force:true} needed so click() works in firefox
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardAccountMenu.getLogoutBtn())).click({ force: true });
})

//Custom command to logout from Admin A5
Cypress.Commands.add("logoutAdminA5", () => {
    arDashboardPage.getShortWait()
    cy.get(arDashboardAccountMenu.getA5AccountSettingsBtn()).should('be.visible').click({ force: true })
    //{force:true} needed so click() works in firefox
    cy.get(arDashboardAccountMenu.getA5LogOffBtn()).click({ force: true });
    arDashboardPage.getShortWait()
})

// Custom command to login to admin side of the blatant portal
Cypress.Commands.add("loginBlatantAdmin", () => {
    let url;
    if (Cypress.env('environment') === "qamain") {
        url = 'https://qa.myabsorb.com/hangfire-MyAbsorbQA-Main-GUIA_CYPRESS'
    } else if (Cypress.env('environment') === "qa2") {
        url = 'https://qa2.myabsorb.com/hangfire-MyAbsorbQA-Secondary-GUIA_CYPRESS'
    }
    cy.visit(url)
    cy.get(arLoginPage.getUsernameTxtF()).type(users.blatAdmin.ADMIN_BLAT_01_USERNAME)
    cy.get(arLoginPage.getPasswordTxtF()).type(users.blatAdmin.ADMIN_BLAT_01_PASSWORD)
    cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
    cy.get(arLoginPage.getLoginBtn()).click()
    arDashboardPage.getMediumWait()
    arDashboardPage.getDismissAbsorbWalkmeBanner()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
})

//Custom command to login to Absorb Create Stand-Alone
Cypress.Commands.add("createAdmin", (username, password) => {
    cy.visit(Cypress.env('createURL'))
    cy.get(createLoginPage.getUsernameTxtF()).type(username)
    cy.get(createLoginPage.getPasswordTxtF()).type(password)
    cy.get(createLoginPage.getLoginBtn()).click()

})

Cypress.Commands.add("createAdminProd", (username, password) => {
    cy.visit(Cypress.env("createProdURL"));
    cy.get(createLoginPage.getUsernameTxtF()).type(username);
    cy.get(createLoginPage.getPasswordTxtF()).type(password);
    cy.get(createLoginPage.getLoginBtn()).click();
});


//Custom command to logout from Create
Cypress.Commands.add("logoutCreate", () => {
    cy.get(createDashboardPage.getLogoutBtn()).click()
    LEDashboardPage.getLShortWait()
    cy.clearLocalStorage() //Clear session storage
})

//Custom command to login to Learner Experience from the Public Dashboard
Cypress.Commands.add("learnerLoginThruDashboardPage", (username, password) => {
    cy.visit("/")
    cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click()
    cy.get(LEDashboardPage.getUsernameTxtF()).type(username)
    cy.get(LEDashboardPage.getPasswordTxtF()).type(password)
    cy.get(LEDashboardPage.getLoginBtn()).click();
    cy.get(LEDashboardPage.getDashboardPageTitle(), { timeout: 60000 }).contains('Welcome')
})

//Custom command to login to Learner Experience with saved session from the Public Dashboard
Cypress.Commands.add("learnerLoginThruDashboardPageWithSession", (username, password) => {
    cy.session('LearnerLogin', () => {
        cy.visit("/")
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click()
        cy.get(LEDashboardPage.getUsernameTxtF()).type(username)
        cy.get(LEDashboardPage.getPasswordTxtF()).type(password)
        cy.get(LEDashboardPage.getLoginBtn()).click();
        cy.get(LEDashboardPage.getDashboardPageTitle(), { timeout: 60000 }).contains('Welcome')
    })
    cy.visit('/')
})

//Custom command to login to Learner Experience from the #/login page
Cypress.Commands.add("learnerLoginThruLoginPage", (username, password) => {
    cy.visit("#/login")
        .get(LELoginPage.getUsernameTxtF()).type(username)
        .get(LELoginPage.getPasswordTxtF()).type(password)
        .get(LELoginPage.getLoginBtn()).click()
    cy.get(LEDashboardPage.getDashboardPageTitle(), { timeout: 60000 }).contains('Welcome')
})


//Custom command to logout from Learner Experience
Cypress.Commands.add("logoutLearner", () => {
    cy.get(LEDashboardPage.getNavMenu()).click()
    cy.get(leDashboardAccountMenu.logoutMenuItemBtn).click();
    LEDashboardPage.getLShortWait() //wait for logout to complete
})

//Custom command to login to Reviewer Page
Cypress.Commands.add("loginReviewer", (username, password) => {
    cy.visit("/reviewer")
    cy.get(reviewerLoginPage.getUsernameTxtF()).type(username)
    cy.get(reviewerLoginPage.getPasswordTxtF()).type(password)
    cy.get(reviewerLoginPage.getLoginBtn()).click();
})


//Custom command to login to LMS via API
Cypress.Commands.add("apiAuth", (username, password, accessMode = 'API') => {
    cy.request({
        method: 'POST',
        url: '/api/rest/v2/authentication',
        headers: {
            "X-Absorb-API-Key": Cypress.env('api_Key'),
        },
        body: {
            "Username": `${username}`,
            "Password": `${password}`,
            "scope": ["Admin", "Learner"],
            "accessMode": accessMode
        }
    })
})

// Custom command to login via Partner Api v2
Cypress.Commands.add("apiAuthPartner", (username, password) => {
    cy.request({
        method: 'POST',
        url: '/oauth/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": Cypress.env('partner_Client_ID'),
            "x-partner-id" : Cypress.env('partner_ID')
        },
        body: {
            "client_Id": Cypress.env('partner_Client_ID'),
            "client_secret": Cypress.env('partner_Client_Secret'),
            "username": `${username}`,
            "password": `${password}`,
            "grant_type": "password",
            "scope": "admin learner openid email profile",
            "response_type": "token",
            "nonce": "test189"
            
        }, failOnStatusCode : false
    })
})

// Custom commad to make GET request SF Api v2
Cypress.Commands.add("getApiSFV2", (URL, queryParams = {}) => {

    cy.apiAuthPartner(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
     let   authToken = response.body.access_token;

    
    cy.request({
        method: 'GET',
        url: URL,
        qs: queryParams,
        headers: {
            Authorization: `Bearer ${authToken}`,
            "x-api-key": Cypress.env('partner_Client_ID'),
            "x-partner-id" : Cypress.env('partner_ID')
        }, failOnStatusCode : false
    })
})
})

// POST Request for  Partner API V2
Cypress.Commands.add("postPartnerApiV2" , (requestBody, queryParams,  URL ) => {
   
    cy.apiAuthPartner(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let   authToken = response.body.access_token;
      
      cy.request({
          method: "POST",
          url: URL ,
          qs: queryParams,
          body: requestBody,
          headers: {
            Authorization: `Bearer ${authToken}`,
            "x-api-key": Cypress.env('partner_Client_ID'),
            "x-partner-id" : Cypress.env('partner_ID')
          },
          failOnStatusCode: false
      })
  })
})
// PATCH Request for  Partner API V2
Cypress.Commands.add("patchPartnerApiV2" , (requestBody, queryParams,  URL ) => {
   
    cy.apiAuthPartner(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let   authToken = response.body.access_token;
      
      cy.request({
          method: "PATCH",
          url: URL ,
          qs: queryParams,
          body: requestBody,
          headers: {
            Authorization: `Bearer ${authToken}`,
            "x-api-key": Cypress.env('partner_Client_ID'),
            "x-partner-id" : Cypress.env('partner_ID')
          },
          failOnStatusCode: false
      })
  })
})

// Custom command to make PUT request Partner API v2
Cypress.Commands.add("putApiPartnerV2" , (URL, queryParams , requestBody) => {
    cy.apiAuthPartner(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        let authToken = response.body.access_token;

        cy.request({
            method: 'PUT',
            url: URL,
            qs: queryParams,
            body: requestBody,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "x-api-key": Cypress.env('partner_Client_ID'),
                "x-partner-id" : Cypress.env('partner_ID')
            }, failOnStatusCode : false

        })
    })
})


//Custom command to login LMS via API V1.5
Cypress.Commands.add("apiAuthV15" , (username, password) => {
    cy.request({
        method: 'POST',
        url: '/authenticate',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": Cypress.env('absorb_api_key')
        },
        body: {
            "username": `${username}`,
            "password": `${password}`,
            "privateKey": Cypress.env('absorb_api_key')
        }
    })
})

//Custom command to login to LMS wih saved session
Cypress.Commands.add("apiLoginWithSession", (username, password, url = '/') => {
    cy.session(`apiLoginWithSession${username}`, () => {
        cy.apiAuth(username, password, 'Browser').then((response) => {
            const token = response.body.token
            cy.setCookie('jwtToken', token)
        });
    });
    cy.visit(url)
    if (url === '/') {
        cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu(), { timeout: 60000 }).should('be.visible')
    }
    cy.visit(url)
    if (url === '/admin') {
        arDashboardPage.getDismissAbsorbWalkmeBanner()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    }
    cy.visit(url)
    if (url === `/${url}`) {

    }
})



/**
 *  The CreateUser custom command is used to create a user using the User API Endpoint
 *  @param {String} departID The id of the department where the user will be created.
 *  @param {String} username This is used as the username of the user to be created.
 *  @param {Array} arrUserTypes The array contains the account type of the User being created
 *  @param {String} userManaType The User Management Type option is required if an Admin user is being created
 *  Example: Use createUser('bc16a743-791a-4425-9f72-daad0186a9f7', ["Reviewer"]) to create a reviewer user account 
 *  Note: This method needs more work to implement Departments and Groups selection for Admin account
 */
Cypress.Commands.add("createUser", (departID = Cypress.env('topDEPT_ID'), userName, arrUserTypes, userManaType) => {

    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const token = response.body.token
        cy.request({
            method: "POST",
            url: "/api/rest/v2/admin/users",
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Absorb-API-Key": Cypress.env('api_Key'),
            },
            body: {
                departmentId: `${departID}`,
                username: userName,
                password: defaultTestData.USER_PASSWORD,
                firstName: defaultTestData.USER_LEARNER_FNAME,
                lastName: defaultTestData.USER_LEARNER_LNAME,
                emailAddress: defaultTestData.USER_LEARNER_EMAIL,
                sendNewUserEmail: true,
                syncedFromSalesforce: false,
                address: defaultTestData.USER_LEARNER_ADDRESS,
                countryCode: defaultTestData.USER_LEARNER_COUNTRY_CODE,
                provinceCode: defaultTestData.USER_LEARNER_PROVINCE_CODE,
                city: defaultTestData.USER_LEARNER_CITY,
                postalCode: defaultTestData.USER_LEARNER_POSTALCODE,
                phone: defaultTestData.USER_LEARNER_PHONE
            },
        }).then((response) => {
            expect(response.status).to.eql(201);
            expect(response.body.username).to.eql(userName);
            if (arrUserTypes.includes("Instructor") === true || arrUserTypes.includes("Reviewer") === true && !(arrUserTypes.includes("Admin") === true)) {
                const index = arrUserTypes.indexOf('Admin')
                if (index > -1) {
                    arrUserTypes.splice(index, 1);
                }
                cy.request({
                    method: "PUT",
                    url: `/api/rest/v2/admin/users/${response.body.id}/user-management-settings`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Absorb-API-Key": Cypress.env('api_Key'),
                    },
                    body: {
                        userTypes: arrUserTypes
                    },
                }).then((response) => {
                    expect(response.status).to.eql(200);
                });
            }

            if (arrUserTypes.includes("Admin") === true) {
                cy.request({
                    method: "PUT",
                    url: `/api/rest/v2/admin/users/${response.body.id}/user-management-settings`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Absorb-API-Key": Cypress.env('api_Key'),
                    },
                    body: {
                        userTypes: arrUserTypes,
                        userManagementType: `${userManaType}`
                    },
                }).then((response) => {
                    expect(response.status).to.eql(200);
                });
            }
        });
    })
})

//Currently used to edit a user's first and last name via API. Pass the user ID, username, and new first & last name
Cypress.Commands.add("editUser", (userID, userName, fName, lName, departID = Cypress.env('topDEPT_ID')) => {
    cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
        const token = response.body.token
        cy.request({
            method: "PUT",
            url: `/api/rest/v2/admin/users/${userID}/profile`,
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Absorb-API-Key": Cypress.env('api_Key'),
            },
            body: {
                departmentId: `${departID}`,
                username: userName,
                password: defaultTestData.USER_PASSWORD,
                firstName: fName,
                lastName: lName,
                emailAddress: defaultTestData.USER_LEARNER_EMAIL
            },
        }).then((response) => {
            expect(response.status).to.eql(200);
        })
    })
})

/**
 * Pass the prefix of the usernames (ex. if usernames are 'user-1', 'user-2', etc - pass 'user' as the prefix)
 * And Pass the number of users you expect to delete (as a double check before we delete)
 * I recomend using a timestamp + number suffix as the usernames if creating & deleting a large number of users
 * !! This function selects all items in the table and deletes them so the usernames should be somewhat unique to the test !!
*/
Cypress.Commands.add("deleteMultipleUsers", (prefix, numUsers) => {
    cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
    arDashboardPage.getUsersReport()
    cy.get(arDashboardPage.getItemsPerPageDDown()).select('50') //Expand report to 50 items
    cy.wrap(arCoursesPage.AddFilter('Username', 'Contains', prefix))
    cy.get(arCoursesPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
    cy.get(arDashboardPage.getRowSelectOptionsBtn()).click()
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getSelectThisPageOption())).click()
    cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Delete Users'), 1000))
    cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete Users')).click()
    cy.get(ARDeleteModal.getDeletePromptContent(), {timeout:6000}).should('contain', `Are you sure you want to delete these ${numUsers} users?`)
    cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')
})

//Pass 'true' if you wish to quick publish the course instead.
Cypress.Commands.add("publishCourse", (quickPublish = false) => {
    if (quickPublish === true) {
        cy.get(arCoursesPage.getQuickPublishBtn()).should('have.attr', 'aria-disabled', 'false').click()
    } else {
        cy.get(arCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'false').click()
    }
    cy
        .wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
    cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')
        .get(arPublishModal.getContinueBtn(), { timeout: 40000 }).should('have.attr', 'aria-disabled', 'false').click()
    cy.wait('@getPublish', { timeout: 40000 })
        .get(arPublishModal.getContinueBtn(),{ timeout: 40000 }).should("not.exist");
})

Cypress.Commands.add("publishCourseAndReturnId", () => {
    cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getPublishBtn(), 700))
    cy.get(arCoursesPage.getPublishBtn()).click()
    cy.get(arPublishModal.getContinueBtn(), { timeout: 30000 }).should('have.attr', 'aria-disabled', 'false').click()
    //cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
    cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')
    //cy.get(arPublishModal.getContinueBtn(), {timeout: 30000}).click()
    //cy.wait('@getPublish')
    cy.intercept('DELETE', '/api/rest/v2/admin/course-drafts/**').as('getUrl').wait('@getUrl', { timeout: 40000 }).then((request) => { })
})

//Pass courseName if you wish to use this function to create multiple courses w/ unique names in the same test
//Pass ilcSession = false if you want to create an ILC without a session
Cypress.Commands.add("createCourse", (courseType, courseName, ilcSession = true) => {
    let courseTypeMod = new basePage().capitalizeString(courseType)
    let name;

    if (courseName != undefined) {
        name = courseName;
    } else {
        switch (courseTypeMod) {
            case 'Online Course':
                name = ocDetails.courseName;
                break;
            case 'Instructor Led':
                name = ilcDetails.courseName;
                break;
            case 'Course Bundle':
                name = cbDetails.courseName;
                break;
            case 'Curriculum':
                name = currDetails.courseName;
                break;
            default:
                console.log(`Sorry, ${courseTypeMod} type does not exist.`);
        }
    }

    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel(`Add ${courseTypeMod}`)).should('have.text', `Add ${courseTypeMod}`).should('have.attr', 'aria-disabled', 'false').click()

    //verify the header and InActive toggle 
    if (courseTypeMod == 'Online Course') {
        cy.get(arCBAddEditPage.getCouseGeneralHeader() + ' ' + arCBAddEditPage.getHeaderLabel()).should('have.text', 'General')
        cy.get(arCBAddEditPage.getGeneralStatusToggleContainer() +' '+ arCBAddEditPage.getToggleDisabled()).should('have.text', "Inactive")
    }
    //Verify the Status Toggle button and text box text
    cy.get(arCBAddEditPage.getGeneralStatusToggleContainer() +' '+ arCBAddEditPage.getToggleDisabled()).should('have.text', "Inactive")
    cy.get(arCBAddEditPage.getGeneralStatusToggleContainer() +' '+ arCBAddEditPage.getToggleDisabled()).click()
    cy.get(arCBAddEditPage.getGeneralStatusToggleContainer() +' '+arCBAddEditPage.getToggleEnabled()).should('have.text', "Active")
    
    //Verify the Status Toggle button and text box text
    arCoursesPage.generalToggleSwitch('true',arILCAddEditPage.getGeneralStatusToggleContainerName())
    arCoursesPage.getLShortWait() //wait as the title field can reset if we type too fast

    switch (courseTypeMod) {
        case 'Online Course':
            // Add Course name 
            //cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear().type(name)
            cy.get(arOCAddEditPage.getRequiredInRedColor()).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
            cy.get(arOCAddEditPage.getGeneralTitleTxtF()).should('have.value', 'Course Name')
            cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear()
            cy.get(arOCAddEditPage.getErrorMsg()).should('contain', 'Field is required.')
            cy.get(arOCAddEditPage.getGeneralLabels()).children().should(($child) => {
                expect($child).to.contain('Status');
                expect($child).to.contain('Title');
                expect($child).to.contain('Description');
                expect($child).to.contain('Language');
                expect($child).to.contain('Tags');
                //expect($child).to.contain('Automatic Tagging')
            })
            cy.get(arOCAddEditPage.getGeneralTitleTxtF()).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            // Add Description
            cy.get(arOCAddEditPage.getWaitSpinner()).should('not.exist')
            //ARDashboardPage.getShortWait()
            //cy.get(arOCAddEditPage.getOCDescriptionTxtFToolBar()).should('be.visible').and('not.have.attr','aria-disabled')
            //cy.get(arOCAddEditPage.getDescriptionTxtF()).type(ocDetails.description)
            // Add Language
            cy.get(arOCAddEditPage.getGeneralLanguageDDown()).click({ force: true })
            cy.get(arOCAddEditPage.getGeneralLanguageDDownOpt()).contains('English').click({ force: true })
            //Add Tags
            /*
            cy.get(arOCAddEditPage.getGeneralTagsDDown()).click()
            cy.get(arOCAddEditPage.getElementByAriaLabelAttribute('Tags')).type(`${commonDetails.tagName}`)
            cy.get(arOCAddEditPage.getGeneralTagsDDownOpt()).contains(`${commonDetails.tagName}`).click()
            */
            break;
        case 'Instructor Led':
            //Add title, description, language
            //cy.get(arILCAddEditPage.getGeneralTitleTxtF()).clear().type(name)
            cy.get(arILCAddEditPage.getGeneralTitleTxtF()).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            cy.get(arOCAddEditPage.getWaitSpinner()).should('not.exist')
            // ARDashboardPage.getShortWait()
            // cy.get(arOCAddEditPage.getILCDescriptionTxtFToolBar()).should('be.visible').and('not.have.attr','aria-disabled')
            // cy.get(arILCAddEditPage.getDescriptionTxtF()).type(ilcDetails.description)
            cy.get(arILCAddEditPage.getGeneralLanguageDDown()).click({ force: true })
            cy.get(arILCAddEditPage.getGeneralLanguageDDownOpt()).contains('English').click({ force: true })
            if (ilcSession === true) {
                // Add Session to ILC with start date 2 days into the future
                arILCAddEditPage.getAddSession(ilcDetails.sessionName, arILCAddEditPage.getFutureDate(2))
                cy.get(arILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
                // Save Session
                cy.get(arILCAddEditPage.getAddEditSessionSaveBtn()).click()
                cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
            }
            break
        case 'Course Bundle':
            //Add title, description, language
            //cy.get(arCBAddEditPage.getGeneralTitleTxtF()).clear().type(name)
            cy.get(arCBAddEditPage.getGeneralTitleTxtF()).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            cy.get(arOCAddEditPage.getWaitSpinner()).should('not.exist')
            //ARDashboardPage.getShortWait()
            //cy.get(arOCAddEditPage.getCBDescriptionTxtFToolBar()).should('be.visible').and('not.have.attr','aria-disabled')
            //cy.get(arCBAddEditPage.getDescriptionTxtF()).type(cbDetails.description)
            cy.get(arCBAddEditPage.getGeneralLanguageDDown()).click({ force: true })
            cy.get(arCBAddEditPage.getGeneralLanguageDDownOpt()).contains(cbDetails.language).click({ force: true })
            // Add Courses to Course Bundle
            cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
            break;
        case 'Curriculum':
            arCURRAddEditPage.WaitForElementStateToChange(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF()))
            //cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).clear().type(name)
            cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            cy.get(arOCAddEditPage.getWaitSpinner()).should('not.exist')
            // ARDashboardPage.getMediumWait()
            // cy.get(arOCAddEditPage.getCURRDescriptionTxtFToolBar()).should('be.visible').and('not.have.attr','aria-disabled')
            // cy.get(arCURRAddEditPage.getDescriptionTxtF()).type(currDetails.description)
            cy.get(arCURRAddEditPage.getGeneralLanguageDDown()).click({ force: true })
            cy.get(arCURRAddEditPage.getGeneralLanguageDDownOpt()).contains(currDetails.language).click({ force: true })
            // Add Courses to Curriculum
            cy.get(arCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
            break;
        default:
            console.log(`Sorry, ${courseTypeMod} type does not exist.`);
    }
})

Cypress.Commands.add("editCourse", (courseName) => {
    cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', courseName))
    cy.get(arCoursesPage.getTableCellName(2), { timeout: 50000 }).should('be.visible').and('contain',`${courseName}`)
    cy.get(arCoursesPage.getTableCellName(2)).contains(courseName).click()
    cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
    cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('More')).scrollIntoView().should('be.visible')
    cy.get(arCoursesPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
})

/**Pass the course type if deleting ILC, Curr, or CB
 * ILC = instructor-led-courses-new
 * CURR = curricula
 * CB = course-bundles
*/
Cypress.Commands.add("deleteCourse", (courseID, type = 'online-courses') => {
    if (courseID != undefined) {
        cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
            const token = response.body.token
            cy.request({
                method: "DELETE",
                url: `/api/rest/v2/admin/${type}/${courseID}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                }
            }).then((response) => {
                expect(response.status).to.eql(200);
                expect(response.body).to.eq('')
            })
        });
    } else {
        cy.addContext('Course not deleted. No courseID was passed to the function')
    }
})

Cypress.Commands.add("deleteUser", (userID) => {
    if (userID != undefined) {
        cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
            const token = response.body.token
            cy.request({
                method: "DELETE",
                url: `/api/rest/v2/admin/users/${userID}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                }
            }).then((response) => {
                expect(response.status).to.eql(200);
                expect(response.body).to.be.eql('')
            })
        });
    } else {
        cy.addContext('User not deleted. No userID was passed to the function')
    }
})

/**
    * Custom command to create a collaboration post (pass type as 'General', or 'Question')
    * Will create the post with Learner 01 by default if no username / password is passed
*/
Cypress.Commands.add("createCollaborationPost", (collaborationId, postSummary, postDescription, type,
    username = users.learner01.LEARNER_01_USERNAME, password = users.learner01.LEARNER_01_PASSWORD) => {
    cy.apiAuth(username, password).then((response) => {
        const token = response.body.token
        cy.request({
            method: "POST",
            url: `/api/rest/v2/collaborations/${collaborationId}/posts`,
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Absorb-API-Key": Cypress.env('api_Key'),
            },
            body: {
                attachments: [],
                description: postDescription,
                title: postSummary,
                type: type
            },
        }).then((response) => {
            expect(response.status).to.eql(201);
        })
    })
})

/**
   *   Pass the Coupon Name and code to create a coupon
*/
Cypress.Commands.add("createCoupon", (Name, Code) => {
    cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1)).should('be.visible').and('contain', 'Coupon')
    cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1)).click()
    cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('have.text', 'Add Coupon').and('be.visible')
    cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')
    cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Name'), {timeout:10000}).should('be.visible').and('not.be.disabled')
    cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Name'), {timeout:10000}).clear().type(Name, {force:true})
    cy.get(ARCouponsAddEditPage.getDescriptionTxtF()).clear().type(AddCouponsData.DESCRIPTION)
    cy.get(ARCouponsAddEditPage.getElementByNameAttribute('Code')).click().type(Code)
})

/**
   *   Save the created coupon 
*/
Cypress.Commands.add("saveCoupon", () => {
    cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
        cy.get(ARCouponsAddEditPage.getCouponSaveBtn()).click()
    })
    cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Coupons')
})

Cypress.Commands.add("deleteCoupon", (code) => {
    cy.get(ARCouponsAddEditPage.getA5WaitSpinner()).should('not.exist')
    ARCouponsAddEditPage.A5AddFilter("Code", "Equals", code)
    cy.get(ARCouponsAddEditPage.getA5WaitSpinner()).should('not.exist')
    cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(3), {timeout:10000}).should('have.text', code).click()
    cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')

    // Click on Delete from Right Sidebar
    cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('contain', 'Delete Coupon').click()
    cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('be.visible').click()
    cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('not.be.visible')
})  
