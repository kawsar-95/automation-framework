export default new (class MLEnvironments {
    // Change this to specify which environment and client to use
    env = "qaMain";
    // env = "secondary";
    // env = "euProd";
    // env = "comProd";
    // env = "auProd";
    // env = "caProd";
    // env = "qa4";
    // env = "ext01";
    // env = "qa5";
    // env = "uat1";
    // env = "comProdSandbox";
    // env = "auSbx";
     
    client = "sml";

    // Environment configs.
    // envs = {
    //      env: {
    //          client: {parameters}
    //     }
    // }
    envs = {
                //For QUIAAR portal on QA main
        qaMain: {
            // For main LMS when creating portals or editing FFs or HFs
            global: {
                urlAdmin: "https://qa.myabsorb.com/admin",
                urlLearner: "https://qa.myabsorb.com",
                top_level_department: "Top Level Dept",
                admin_username: "admin",
                admin_password: "leaRnic0rn",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            kslqamain: {
                urlAdmin: "https://ksl-qa-main.qa.myabsorb.com/admin",
                urlLearner: "https://ksl-qa-main.qa.myabsorb.com/",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            // For small portal on QA Main
            sml: {
                urlAdmin: "https://mlSmallPortal.qa.myabsorb.com/admin",
                urlLearner: "https://mlSmallPortal.qa.myabsorb.com",
                urlPublicDashboard: "https://mlsmallportal.qa.myabsorb.com/#/public-dashboard",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
                learner_username1: "TTC_Learner_01",
                learner_password1: "testing12345",
                learner_username2: "TTC_Learner_02",
                learner_password2: "testing12345",
                learner_username3: "TTC_Learner_03",
                learner_password3: "testing12345",
                learner_username4: "TTC_Learner_04",
                learner_password4: "testing12345",
                learner_username5: "TTC_Learner_05",
                learner_password5: "testing12345",
            },
        },
        secondary: {
            // For main LMS when creating portals or editing FFs or HFs
            global: {
                urlAdmin: "https://qa2.myabsorb.com/admin",
                admin_username: "admin",
                admin_password: "leaRnic0rn",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            //For specific portal on Secondary
            kslqamain: {
                urlAdmin: "https://ksldazedog.qa2.myabsorb.com/admin",
                urlLearner: "https://ksldazedog.qa2.myabsorb.com",
                top_level_department: "Top Level Dept",
                admin_username: "kslsysqa2",
                admin_password: "Testing1!",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            //For small portal on Secondary
            sml: {
                urlAdmin: "https://mlsmallportal.qa2.myabsorb.com/admin",
                urlLearner: "https://mlsmallportal.qa2.myabsorb.com/",
                urlPublicDashboard: "https://mlsmallportal.qa2.myabsorb.com/#/public-dashboard",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
                learner_username1: "TTC_Learner_01",
                learner_password1: "testing12345",
                learner_username2: "TTC_Learner_02",
                learner_password2: "testing12345",
                learner_username3: "TTC_Learner_03",
                learner_password3: "testing12345",
                learner_username4: "TTC_Learner_04",
                learner_password4: "testing12345",
                learner_username5: "TTC_Learner_05",
                learner_password5: "testing12345",
            },
        },
        euProd: {
            //For specific portal on EU
            sml: {
                urlAdmin: "https://learnermobilebeta.myabsorb.eu/admin",
                urlLearner: "https://learnermobilebeta.myabsorb.eu",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "BingBong1905!",
            },
        },
        comProd: {
            //For specific portal on COM
            sml: {
                urlAdmin: "https://absorblearnmobile.myabsorb.com/admin",
                urlLearner: "https://absorblearnmobile.myabsorb.com",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "BingBong1905!",
            },
        },
        auProd: {
            //For specific portal on AU
            sml: {
                urlAdmin: "https://learnermobilebeta.myabsorb.com.au/admin",
                urlLearner: "https://learnermobilebeta.myabsorb.com.au",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "BingBong1905!",
            },
        },

        auSbx: {
            //For specific portal on AU
            sml: {
                urlAdmin: "https://mlsmallportal.sandbox.myabsorb.com.au/admin",
                urlLearner: "https://mlsmallportal.sandbox.myabsorb.com.au",
                urlPublicDashboard: "https://mlsmallportal.sandbox.myabsorb.com.au/#/public-dashboard",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "BingBong1905!",
                learner_username1: "TTC_Learner_01",
                learner_password1: "testing12345",
                learner_username2: "TTC_Learner_02",
                learner_password2: "testing12345",
                learner_username3: "TTC_Learner_03",
                learner_password3: "testing12345",
                learner_username4: "TTC_Learner_04",
                learner_password4: "testing12345",
                learner_username5: "TTC_Learner_05",
                learner_password5: "testing12345",
            },
        
            //For specific portal on Secondary
            kslqamain: {
                urlAdmin: "https://mlsmallportaltwo.sandbox.myabsorb.com.au/admin",
                urlLearner: "https://mlsmallportaltwo.sandbox.myabsorb.com.au",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "BingBong1905!",
            },
        },   

        caProd: {
            //For specific portal on CA
            sml: {
                urlAdmin: "https://learnermobilebeta.myabsorb.ca/admin",
                urlLearner: "https://learnermobilebeta.myabsorb.ca",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "BingBong1905!",
            },
        },

        qa4: {
            // For main LMS when creating portals or editing FFs or HFs
            global: {
                urlAdmin: "https://4.qa.absorb.ad/admin",
                admin_username: "admin",
                admin_password: "leaRnic0rn",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            //For specific portal
            sml: {
                urlAdmin: "https://mlsmallportal.4.qa.absorb.ad/admin",
                urlLearner: "https://mlsmallportal.4.qa.absorb.ad",
                urlPublicDashboard: "https://mlsmallportal.4.qa.absorb.ad/#/public-dashboard",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
                learner_username1: "TTC_Learner_01",
                learner_password1: "testing12345",
                learner_username2: "TTC_Learner_02",
                learner_password2: "testing12345",
                learner_username3: "TTC_Learner_03",
                learner_password3: "testing12345",
                learner_username4: "TTC_Learner_04",
                learner_password4: "testing12345",
                learner_username5: "TTC_Learner_05",
                learner_password5: "testing12345",
            },
        },

        ext01: {
            // For main LMS when creating portals or editing FFs or HFs
            global: {
                urlAdmin: "https://ext01.qa-myabsorb.com/admin",
                admin_username: "admin",
                admin_password: "leaRnic0rn",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            //For specific portal
            sml: {
                urlAdmin: "https://mlsmallportal-ext01.qa-myabsorb.com/admin",
                urlLearner: "https://mlsmallportal-ext01.qa-myabsorb.com",
                urlPublicDashboard: "https://mlsmallportal-ext01.qa-myabsorb.com/#/public-dashboard",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
                learner_username1: "TTC_Learner_01",
                learner_password1: "testing12345",
                learner_username2: "TTC_Learner_02",
                learner_password2: "testing12345",
                learner_username3: "TTC_Learner_03",
                learner_password3: "testing12345",
                learner_username4: "TTC_Learner_04",
                learner_password4: "testing12345",
                learner_username5: "TTC_Learner_05",
                learner_password5: "testing12345",
            },
        },

        qa5: {
            // For main LMS when creating portals or editing FFs or HFs
            global: {
                urlAdmin: "https://5.qa.absorb.ad/admin",
                admin_username: "admin",
                admin_password: "leaRnic0rn",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            //For specific portal
            sml: {
                urlAdmin: "https://mlsmallportal.5.qa.absorb.ad/admin",
                urlLearner: "https://mlsmallportal.5.qa.absorb.ad",
                urlPublicDashboard: "https://mlsmallportal.5.qa.absorb.ad/#/public-dashboard",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
                learner_username1: "TTC_Learner_01",
                learner_password1: "testing12345",
                learner_username2: "TTC_Learner_02",
                learner_password2: "testing12345",
                learner_username3: "TTC_Learner_03",
                learner_password3: "testing12345",
                learner_username4: "TTC_Learner_04",
                learner_password4: "testing12345",
                learner_username5: "TTC_Learner_05",
                learner_password5: "testing12345",
            },
            //For specific portal on 5.qa
            kslqamain: {
                urlAdmin: "https://kslqa5.5.qa.absorb.ad/admin",
                urlLearner: "https://kslqa5.5.qa.absorb.ad",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1!",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
        },
        uat1: {
            // For main LMS when creating portals or editing FFs or HFs
            global: {
                urlAdmin: "https://uat1.myabsorb.com/admin",
                admin_username: "admin",
                admin_password: "leaRnic0rn",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            // For main LMS when creating portals or editing FFs or HFs
            guiaar: {
                urlAdmin: "https://mlsmallportaltwo.uat1.myabsorb.com/admin",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
            //For specific portal
            sml: {
                urlAdmin: "https://mlsmallportal.uat1.myabsorb.com/admin",
                urlLearner: "https://mlsmallportal.uat1.myabsorb.com",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "testing1",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
        },

        comProdSandbox: {
            // // For main LMS when creating portals or editing FFs or HFs
            // global: {
            //     urlAdmin: "https://sandbox.myabsorb.com/admin",
            //     admin_username: "admin",
            //     admin_password: "leaRnic0rn",
            //     learner_username: "zzzML-Learner",
            //     learner_password: "Testing1!",
            // },
            //For specific portal
            sml: {
                urlAdmin: "https://mlsmallportal.sandbox.myabsorb.com/admin",
                urlLearner: "https://mlsmallportal.sandbox.myabsorb.com",
                top_level_department: "Top Level Dept",
                admin_username: "mlsysadmin",
                admin_password: "BingBong1905",
                learner_username: "zzzML-Learner",
                learner_password: "Testing1!",
            },
        },
    };

    getParam(param, client) {
        client = typeof client !== "undefined" ? client : this.client;
        return this.envs[this.env][client][param];
    }

    signInAdmin(client) {
        // default client to use if none specified
        client = typeof client !== "undefined" ? client : this.client;

        //Sign in as Admin
        cy.visit(this.getParam("urlAdmin", client));
        cy.wait(1000);
        cy.get(`[name="username"]`).type(this.getParam("admin_username", client));
        cy.get('[name="password"]').type(this.getParam("admin_password", client));
        cy.get('[type="submit"]').click();
        cy.wait(3000);
    }

    signInLearner(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlLearner", client));
        // cy.get(`[class*="btn header-module__login_form_btn"]`).contains("Login").click();
        cy.get(`[name="username"]`).type(this.getParam("learner_username", client));
        cy.get('[name="password"]').type(this.getParam("learner_password", client));
        cy.get('[type="submit"]').click();
        cy.wait(1000);
    }

    signInLearner1(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlLearner", client));
        // cy.get(`[class*="btn header-module__login_form_btn"]`).contains("Login").click();
        cy.get(`[name="username"]`).type(this.getParam("learner_username1", client));
        cy.get('[name="password"]').type(this.getParam("learner_password1", client));
        cy.get('[type="submit"]').click();
        cy.wait(1000);
    }  

    signInLearner2(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlLearner", client));
        // cy.get(`[class*="btn header-module__login_form_btn"]`).contains("Login").click();
        cy.get(`[name="username"]`).type(this.getParam("learner_username2", client));
        cy.get('[name="password"]').type(this.getParam("learner_password2", client));
        cy.get('[type="submit"]').click();
        cy.wait(1000);
    }    

    signInLearner3(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlLearner", client));
        // cy.get(`[class*="btn header-module__login_form_btn"]`).contains("Login").click();
        cy.get(`[name="username"]`).type(this.getParam("learner_username3", client));
        cy.get('[name="password"]').type(this.getParam("learner_password3", client));
        cy.get('[type="submit"]').click();
        cy.wait(1000);
    }    

    signInLearner4(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlLearner", client));
        // cy.get(`[class*="btn header-module__login_form_btn"]`).contains("Login").click();
        cy.get(`[name="username"]`).type(this.getParam("learner_username4", client));
        cy.get('[name="password"]').type(this.getParam("learner_password4", client));
        cy.get('[type="submit"]').click();
        cy.wait(1000);
    }  
    
    signInLearner5(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlLearner", client));
        // cy.get(`[class*="btn header-module__login_form_btn"]`).contains("Login").click();
        cy.get(`[name="username"]`).type(this.getParam("learner_username5", client));
        cy.get('[name="password"]').type(this.getParam("learner_password5", client));
        cy.get('[type="submit"]').click();
        cy.wait(1000);
    }  

    viewPublicDashboard(client) {
        //Sign in as Learner
        cy.visit(this.getParam("urlPublicDashboard", client));
        cy.wait(1000);
    }

    testInformation() {
        const dayjs = require("dayjs");
        cy.log(dayjs().format("[Date & Time:] YYYY-MM-DDTHH:mm:ssZ[Z]"));
        cy.log(this.env); //Environment tested in
        cy.log('5.117.0.296 & 0.1.0.39'); //QA Main
        // cy.log('5.116.2.20 & 0.1.0.39'); //Secondary
        // cy.log('5.116.0.4.7 & 0.1.0.39'); //Production
        // cy.log('5.116.0.631 & 0.1.0.39'); //5.qa
        // cy.log('5.115.5.22 & 0.1.0.39'); //AU Sandbox
    }
})();
