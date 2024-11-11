import defaultTestData from '../../../fixtures/defaultTestData.json'
import arBasePage from '../../../../helpers/AR/ARBasePage'
import users from "../../../fixtures/users.json";

let authToken;
let userID;
let username = "apiTest01-" + new arBasePage().getTimeStamp()
const arrayUserTypes = ["Reviewer", "Admin"]

describe("API - Basic Users Tests", () => {
    before(() => {
        cy.apiAuth(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD).then((response) => {
            authToken = response.body.token;
        })
    })

    describe("Users Tests - A", () => {
        it("GET - List of Users", () => {
            cy.request({
                method: "GET",
                url: "/api/rest/v2/admin/users",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.body).to.have.property("totalItems");
                expect(response.body.totalItems).to.be.above(0);
                expect(response.body).to.have.property("returnedItems");
                expect(response.body.returnedItems).to.be.above(0);
                expect(response.body).to.have.property("limit");
                expect(response.body.limit).to.be.above(0);
                expect(response.body).to.have.property("offset");
                expect(response.body.offset).to.be.eql(0);
            });
        });

        it("POST - Create a User", () => {
            cy.request({
                method: "POST",
                url: "/api/rest/v2/admin/users",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
                body: {
                    departmentId: Cypress.env('topDEPT_ID'),
                    username: username,
                    password: defaultTestData.USER_PASSWORD,
                    firstName: defaultTestData.USER_LEARNER_FNAME,
                    lastName: defaultTestData.USER_LEARNER_LNAME,
                    emailAddress: defaultTestData.USER_LEARNER_EMAIL,
                    sendNewUserEmail: true,
                    syncedFromSalesforce: true,
                    address: defaultTestData.USER_LEARNER_ADDRESS,
                    countryCode: defaultTestData.USER_LEARNER_COUNTRY_CODE,
                    city: defaultTestData.USER_LEARNER_CITY
                },
            }).then((response) => {
                expect(response.status).to.eql(201);
                expect(response.body.username).to.eql(username);
                userID = response.body.id;
                if (arrayUserTypes.includes("Instructor") === true || arrayUserTypes.includes("Reviewer") === true && !(arrayUserTypes.includes("Admin") === true)) {
                    const index = arrayUserTypes.indexOf('Admin')
                    if (index > -1) {
                        arrayUserTypes.splice(index, 1);
                    }
                    cy.request({
                        method: "PUT",
                        url: `/api/rest/v2/admin/users/${response.body.id}/user-management-settings`,
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            "X-Absorb-API-Key": Cypress.env('api_Key'),
                        },
                        body: {
                            userTypes: arrayUserTypes
                        },
                    }).then((response) => {
                        expect(response.status).to.eql(200);
                    });
                }

                if (arrayUserTypes.includes("Admin") === true) {
                    cy.request({
                        method: "PUT",
                        url: `/api/rest/v2/admin/users/${response.body.id}/user-management-settings`,
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            "X-Absorb-API-Key": Cypress.env('api_Key'),
                        },
                        body: {
                            userTypes: arrayUserTypes,
                            userManagementType: "All"
                        },
                    }).then((response) => {
                        expect(response.status).to.eql(200);
                    });
                }
            });
        });


        it("GET - A User", () => {
            cy.request({
                method: "GET",
                url: `/api/rest/v2/admin/users/${userID}`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.body.username).to.eql(username);
            });
        });

        it("GET - List edits made to the user", () => {
            cy.request({
                method: "GET",
                url: `/api/rest/v2/admin/users/${userID}/history`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.status).to.eql(200);
            });
        });
    });

    describe("Contact Information", () => {
        it("GET - Contact Information", () => {
            cy.request({
                method: "GET",
                url: `/api/rest/v2/admin/users/${userID}/contact-information`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.body.address1).to.be.eql(defaultTestData.USER_LEARNER_ADDRESS);
                expect(response.body.city).to.be.eql(defaultTestData.USER_LEARNER_CITY);
            });
        });

        it("UPDATE - User Contact Information", () => {
            cy.request({
                method: "PUT",
                url: `/api/rest/v2/admin/users/${userID}/contact-information`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
                body: {
                    address1: "API Test Street SW",
                    countryCode: "CA",
                    city: "Calgary"
                },
            }).then((response) => {
                expect(response.status).to.eql(200);
                expect(response.body.address1).to.be.eql('API Test Street SW');
            });
        });
    });

    describe("Custom Field", () => {
        it("GET - Get custom fields", () => {
            cy.request({
                method: "GET",
                url: `/api/rest/v2/admin/users/${userID}/custom-fields`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.status).to.eql(200);
            });
        });

        xit("Save custom field values", () => {
            cy.request({
                method: "PUT",
                url: `/api/rest/v2/admin/users/${userID}/custom-fields`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
                body: {
                    "customFields": [
                        {
                            "value": "Thises"
                        }
                    ]
                }
            }).then((response) => {
                expect(response.status).to.eql(200);
            });
        });
    });


    describe("Users Tests - B", () => {
        it("DELETE - A User", () => {
            cy.request({
                method: "DELETE",
                url: `/api/rest/v2/admin/users/${userID}`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.status).to.eql(200);
                expect(response.body).to.be.eql('')
            });
        });
    });


});
