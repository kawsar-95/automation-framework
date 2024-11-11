// TestRail TC reference: Course Thumbnail Suggestions:  https://absorblms.testrail.io/index.php?/cases/view/8723

/// <reference types="cypress" />
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import { learnerDetails } from "../../../../../../helpers/TestData/ML/learnerData";
import { courseDetails } from "../../../../../../helpers/TestData/ML/courseData";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";

describe("Regression - Trending Courses", function () {

    //Due to Cypress timeout/crashing issues this additional test was placed into EstimatedTimeToComplete as well:
    // 4_ML-3002-GUIA-Auto-Regression-TimeToComplete-All-Other-Tests.js

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
  
    it("Check trending course in Private dasboard", () => {
        //Go to Website
        MLEnvironments.signInLearner("sml");
        //Check TTCTestAutomatic course is in the Trending Course section.
        cy.get(`[class*="dashboard__ribbon"]`).contains("Trending Courses").should("exist");
        cy.get(`[class*="dashboard__ribbon"]`).last().contains("zzz-Trending-Course").should("exist");
    });

    it("Sort trending course on Catalog view in Private dasboard", () => {
        MLEnvironments.signInLearner("sml");
        cy.wait(5000);
        cy.get(`[class*="dashboard-tile-wrapper-module__tile"]`).contains("Catalog").click();
        cy.wait(2000);
        cy.get('[id="CatalogSortDropDown"]').select('Trending');
        cy.wait(2000);
        cy.get(`[class*="catalog-module__cards_container"]`).contains("zzz-Trending-Course").should("exist");
    });    

    it("Ensure a pinned course will display before the sorted trending courses view. ", () => {
        MLEnvironments.signInLearner("sml");
        cy.wait(5000);
        cy.get(`[class*="dashboard-tile-wrapper-module__tile"]`).contains("Catalog").click();
        cy.wait(2000);
        cy.get('[id="CatalogSortDropDown"]').select('Trending');
        cy.wait(2000);
        cy.get(`[class*="card-module__name"]`).contains("zzz-ML-Curriculum").click();
        cy.wait(2000);
        cy.get(`[class*="icon-pin"]`).click();
         cy.wait(2000);
        cy.get(`[class*="header-module__brand_logo"]`).click();
        cy.wait(2000);
        cy.get(`[class*="dashboard-tile-wrapper-module__tile"]`).contains("Catalog").click();
        cy.wait(2000);
        cy.get('[id="CatalogSortDropDown"]').select('Trending');
        cy.wait(2000);
        cy.get(`[class*="card-module__pin"]`).should("exist");
        cy.wait(2000);
        cy.get(`[class*="card-module__name"]`).contains("zzz-ML-Curriculum").click();
        cy.wait(2000);
        cy.get(`[class*="icon-pin"]`).click();
        cy.wait(500);
        cy.get(`[class*="Toastify__toast Toastify__toast-theme--light"]`).contains("Unpinned successfully.").should("exist");
    });  

    it("As admin create a Ribbon for public dashboard", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.wait(1000);
        cy.get(`[data-name="button-account"]`).click();
        cy.wait(1000);        
        cy.get('[class*="button_link_xelcc"]').contains("Learner Experience").click();
        cy.wait(7000);
        //Open the Manage Template
        cy.get(`[data-name="nav-menu-button"]`).click();
        cy.wait(3000);        
        cy.get('[class*="navigation-menu-module"]').contains("Manage Template").click();
        cy.wait(3000);        
        cy.get('[class*="horizontal-tab-list-module__tab"]').contains("Public Dashboard").click();
        cy.wait(2000);        
        cy.get(`[class*="public-dashboard-list-module__toggle"] [class*="toggle-module__switch"]`).click({force:true});
        //Add a Ribbon for Trending Courses
        cy.get('[class*="expandable-content__title"]').contains("Content").click();
        cy.wait(2000);        
        cy.get('[class*="dashboard-list__add_btn"]').contains("Add New Container").click();
        cy.wait(2000);
        cy.get(`[class*="dashboard-container-module__header"]`).get("select").last().select("Ribbon"); 
        cy.wait(2000); 
        cy.get('[name="ribbon-dropdown"]').last().select("Trending Courses");
        cy.wait(4000);
        cy.get('[class*="form-buttons__save_button"]').contains("Save").click();
        cy.wait(3000);
    });

    it("Check existing trending course in Public dasboard", () => {
        MLEnvironments.viewPublicDashboard("sml");  
        cy.wait(2000);
        //Check zzz-Trending-Course is in the Trending Course section.
        cy.get(`[class*="dashboard__ribbon"]`).contains("Trending Courses").should("exist");
        cy.get(`[class*="dashboard__ribbon"]`).last().contains("zzz-Trending-Course").should("exist");

    });

    it("ML-1085 - Add public course to cart by selecting the blue $1234.00 button ", () => {
        MLEnvironments.viewPublicDashboard("sml");  
        cy.wait(4000);
        //Select 
        cy.get('[class*="action-button-module__title"]').contains("$1234.00").click();
        cy.wait(8000);
        //Check the course tile button changes to 'Added to Cart'
        cy.get(`[class*="action-button-module__title"]`).contains("Added to Cart").should("exist");
        //Check that the shopping cart icon has updated displaying '1'
        cy.get(`[id="header-shopping-cart-item-count"]`).contains("1").should("exist");
        //Select the shopping cart icon
        cy.get('[class*="icon-cart"]').click();
        cy.wait(2000);
        //Check that the shopping cart menu has selected course for purchase
        cy.get(`[class*="shopping-cart-menu-item-module__name"]`).contains("zzz-Trending-Course").should("exist");
        cy.get(`[class*="shopping-cart-menu-item-module__course_type"]`).contains("Online Course").should("exist"); //5.115
        // cy.get(`[class*="shopping-cart-menu-item-module__type"]`).contains("Online Course").should("exist"); //5.114
        cy.get(`[class*="shopping-cart-menu-item-module__price"]`).contains("$1234.00").should("exist");
        //Remove the course from the shopping cart menu
        cy.get('[class*="shopping-cart-menu-item-module__remove_btn"]').click();
        cy.wait(500);
        cy.get(`[class*="Toastify__toast Toastify__toast-theme--light"]`).contains("Removed from Cart").should("exist");
        cy.wait(2000);
        cy.get(`[class*="action-button-module__title"]`).contains("$1234.00").should("exist");
    }); 

    it("ML-1085 - Add public course to cart from the course pop-up window ", () => {
        MLEnvironments.viewPublicDashboard("sml");  
        cy.wait(2000);
        //Select 
        cy.get('[class*="card-module__name"]').contains("zzz-Trending-Course").click();
        cy.wait(2000);
        //Check the course tile button changes to 'Added to Cart'
        cy.get(`[data-name="course-discovery-start-button"]`).contains("Add to Cart").click();
        cy.wait(4000);
        cy.get(`[data-name="course-discovery-start-button"]`).contains("View Cart").click();
        cy.wait(2000);
        //Check that the shopping cart item list'
        cy.get(`[class*="cart-item-price-module__cart_item_price"]`).contains("$1234.00").should("exist"); //5.115
        // cy.get(`[class*="cart-review-module__subtotal_price"]`).contains("$1234.00").should("exist"); //5.114
        //Remove the course from the shopping cart menu
        cy.get('[class*="module__remove_btn"]').click();
        cy.wait(500);
        cy.get(`[class*="Toastify__toast Toastify__toast-theme--light"]`).contains("Removed from Cart").should("exist");
        cy.wait(1000);
        cy.get(`[class*="cart-review-module__empty_title"]`).contains("Your shopping cart is empty.").should("exist");
    }); 

    it("Turn off public dashboard back to default", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.wait(1000);
        cy.get(`[data-name="button-account"]`).click();
        cy.wait(1000);        
        cy.get('[class*="button_link_xelcc"]').contains("Learner Experience").click();
        cy.wait(7000);
        //Open the Manage Template
        cy.get(`[data-name="nav-menu-button"]`).click();
        cy.wait(1000);        
        cy.get('[class*="navigation-menu-module"]').contains("Manage Template").click();
        cy.wait(3000);        
        cy.get('[class*="horizontal-tab-list-module__tab"]').contains("Public Dashboard").click();
        //Remove the Ribbon for Trending Courses that was added
        cy.get('[class*="expandable-content__title"]').contains("Content").click();
        cy.wait(3000);        
        cy.get('[class*="dashboard-container__delete_btn"]').last().click();
        cy.wait(2000);
        cy.get('[class*="save_button button-module__btn"]').contains("Save").click();
        // cy.wait(5000);        
        cy.get(`[class*="public-dashboard-list-module__toggle"] [class*="toggle-module__switch"]`).click({force:true});
    });
 
});