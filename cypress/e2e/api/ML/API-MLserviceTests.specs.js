
let serviceURL =
  //QA URLs 
  "http://internal-ALB-ECS-MlServices-QaMain-997871286.us-east-1.elb.amazonaws.com"; //base url for QA Main

  //Secondary
  // "http://internal-alb-ecs-mlservices-qasecondary-557557269.us-east-1.elb.amazonaws.com"; //base url for qa secondary

  // Numbered QA:
  // "http://internal-alb-ecs-mlservices-5-qa-381394997.us-east-1.elb.amazonaws.com"; //base url for 5.qa

  //UAT1 URLs:
  // "http://internal-alb-ecs-mlservices-uatprimary-1803384887.us-east-1.elb.amazonaws.com";

  //Prod URLs
  //CA: 
  // "http://internal-ALB-ECS-MLSERVICES-498479737.ca-central-1.elb.amazonaws.com";
  //US:
  // "http://internal-ALB-ECS-MLSERVICES-1622752265.us-east-1.elb.amazonaws.com";
  //AU: 
  // "http://internal-ALB-ECS-MLSERVICES-1813034510.ap-southeast-2.elb.amazonaws.com";
  //EU: 
  // "http://internal-ALB-ECS-MLSERVICES-964742544.eu-west-1.elb.amazonaws.com";

  //Skills API URL
  //"http://internal-alb-ecs-mlservices-5-qa-381394997.us-east-1.elb.amazonaws.com/skills/docs" //base url for 5.qa
  
describe("API - Basic MLservice tests", () => {

 it("Test Information", function () {
  const dayjs = require('dayjs')
  cy.log(dayjs().format('[Date & time:] YYYY-MM-DDTHH:mm:ssZ[Z]'))
  cy.log(serviceURL); //Environment tested in
  cy.log('5.117.0.296 & 0.1.0.39'); //QA Main
  // cy.log('5.116.2.20 & 0.1.0.39'); //Secondary
  // cy.log('5.116.1.51 & 0.1.0.39'); //Secondary
  // cy.log('5.116.0.623 w ZDT'); //Secondary
  // cy.log('5.116.0.4.7 & 0.1.0.39'); //Production
  // cy.log('5.116.0.545 & 0.1.0.39'); //5.qa
 });

 it("test media suggestion query is returing results", () => {
    let url = serviceURL + "/media/suggestions";
    let body = {
      query: "dogs playing in snow",
      user: "7fc11f4e-47b0-4e4b-89b6-2559d52bf5d7",
      client: "ed27754b-e4ea-4127-9720-63065ebcff9d",
      size: 22,
      language: "en",
      suggestive: false,
    };
    cy.request({
      method: "POST",
      url: url,
      body: body,
    }).then((response) => {
      console.log("response", response.body);
      expect(response.body).to.not.eq(null);
      expect(response.body.results.length).to.gt(10);
    });
  });

  it("test health check endpoint is responding", () => {
    let url = serviceURL + "/health";

    cy.request({
      method: "GET",
      url: url,
    }).then((response) => {
      console.log("response", response.body);
      expect(response.status).eq(200);
      expect(response.body.message).eq("alive");
    });
  });

  it("test admin-search suggestions endpoint is responding for simple query", () => {
    let url = serviceURL + "/admin-search-suggestions";
    let reqBody = {
      query: "enroll in Best Course Ever",
      user: "7fc11f4e-47b0-4e4b-89b6-2559d52bf5d7",
      client: "ed27754b-e4ea-4127-9720-63065ebcff9d",
      path: "/admin/onlineCourses/add",
      language: "en",
      timezone: "America/Toronto",
      entity_names: [
        {
          text: "best course ever",
          start_index: 10,
          type: "course",
        },
      ],
    };
    cy.request({
      method: "POST",
      url: url,
      body: reqBody,
    }).then((response) => {
      console.log("response", response.body);
      expect(response.status).eq(200);
      expect(response.body.results.length).to.gt(0);
      let results = response.body.results;
      expect(results[0].intent).eq("view_course_enrollments");
      expect(results[0].report).eq("courseEnrollments");
    });
  });

  it("test admin-search suggestions for date time filter", () => {
    let url = serviceURL + "/admin-search-suggestions";
    let checkdate = function (datestring) {
        let result = datestring.match("dateAdded ge datetime\.* and dateAdded le datetime\.*")
        if (result.length === 1) {
            return true
        } else {
            return false
        }
    }
    let reqBody = {
      query: "users added last month",
      user: "7fc11f4e-47b0-4e4b-89b6-2559d52bf5d7",
      client: "ed27754b-e4ea-4127-9720-63065ebcff9d",
      path: "/admin",
      language: "en",
      timezone: "America/Toronto",
      entity_names: [],
    };
    cy.request({
      method: "POST",
      url: url,
      body: reqBody,
    }).then((response) => {
      console.log("response", response.body);
      expect(response.status).eq(200);
      expect(response.body.results.length).to.gt(0);
      let results = response.body.results;
      expect(results[0].intent).eq("view_users");
      expect(results[0].report_fields).eq("dateAdded");
      expect(checkdate(results[0].report_filters)).to.be.true;
    });
  });




  it("test filter-suggestion is responding correctly for basic query", () => {
    let url = serviceURL + "/report-filter-suggestions";
    let reqBody = {
      report: "Courses",
      size: 4,
      current: [],
      user_department_name: "blatant^",
      user_roles: [
        "Feature Flags Manager",
        "Update Scripts Manager",
        "Blatant Admin",
      ],
      user_created_on: "2015-06-05T16:55:02.477000",
      ignore: [],
      user: "8183eb78-b449-4344-b037-f99fb347b066",
      client: "00000000-aaaa-bbbb-5555-00001212bbbb",
    };

    cy.request({
      method: "POST",
      url: url,
      body: reqBody,
    }).then((response) => {
      console.log("response", response.body);
      expect(response.status).eq(200);
      expect(response.body.suggestions.length).to.gt(0);
      let suggestions = response.body.suggestions;
    });
  });
});
