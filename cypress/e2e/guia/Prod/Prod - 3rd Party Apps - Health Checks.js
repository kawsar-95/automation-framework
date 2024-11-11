//These test steps check the endpoints seen on the 'Microservices' 
//Grafana page: https://status.absorb.ad/d/nD4uYl8mk/up-status-microservices?orgId=1&refresh=30s&from=now-5m&to=now

const jsonPropertyName1 = 'IsHealthy';
const jsonPropertyName2 = 'status';
const strStatusText = 'Healthy';

const currentDayOfWeek = new Date().getDay();
const ENUM_MONDAY = 1;

function CheckHealth(strURL, strJSONProperty, strExpectText = null) {
    cy.request({
        method: "GET",
        url: strURL,
    }).then((response) => {
        if (strExpectText !== null) {
            expect(response.body).to.eql(strExpectText);
        } else if (strJSONProperty === jsonPropertyName1) {
            expect(response.body[strJSONProperty]).to.eql(true);
        } else {
            expect(response.body[strJSONProperty]).to.eql(strStatusText);
        }
    });
}

describe('Prod - 3rd Party Apps - Health Checks', function(){

  // -------------------------------- LinkedIn Learning --------------------------------

  it('LinkedIn Learning - Verify Health - US', () => {
    CheckHealth('https://linkedinservice.absorb.ad:4443/api/rest/v2/health', jsonPropertyName1);
  });

  it('LinkedIn Learning - Verify Health - CA', () => {
    CheckHealth('https://linkedinservice.myabsorb.ca:4443/api/rest/v2/health', jsonPropertyName1);
  });

  it('LinkedIn Learning - Verify Health - EU', () => {
    CheckHealth('https://linkedinservice.myabsorb.eu:4443/api/rest/v2/health', jsonPropertyName1);
  });

  // -------------------------------- Skillsoft --------------------------------
  // At some time on the weekend these 2 endpoints go down. We have a script that brings them back up 
  //that runs sometime before Tuesday, so skip these tests if today is monday (when getDay() === 1)

  if (currentDayOfWeek === ENUM_MONDAY) {
      cy.addContext('Skipping Skillsoft Tests as today is Monday')
  } else {
    it('Skillsoft - Verify Health - US', function() {
        CheckHealth('https://skillsoft.absorb.ad:4443/api/health', jsonPropertyName1);
      });
    
      it('Skillsoft - Verify Health - CA', function() {
        CheckHealth('https://skillsoft-ca.absorb.ad:4443/api/health', jsonPropertyName1);
      });
  }

  // -------------------------------- Biz Library --------------------------------
  it('Biz Library - Verify Health - US', () => {
    CheckHealth('https://bizlibrary.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Biz Library - Verify Health - AU', () => {
    CheckHealth('https://bizlibrary-au.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Biz Library - Verify Health - CA', () => {
    CheckHealth('https://bizlibrary-ca.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Biz Library - Verify Health - EU', () => {
    CheckHealth('https://bizlibrary-eu.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  // -------------------------------- Bamboo HR --------------------------------

  it('Bamboo HR - Verify Health - US', () => {
    CheckHealth('https://bamboohr.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - US (Sandbox)', () => {
    CheckHealth('https://bamboohr.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - CA', () => {
    CheckHealth('https://bamboohr-ca.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - CA (Sandbox)', () => {
    CheckHealth('https://bamboohr-ca.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - EU', () => {
    CheckHealth('https://bamboohr-eu.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - EU (Sandbox)', () => {
    CheckHealth('https://bamboohr-eu.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - AU', () => {
    CheckHealth('https://bamboohr-au.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Bamboo HR - Verify Health - AU (Sandbox)', () => {
    CheckHealth('https://bamboohr-au.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  // -------------------------------- Salesforce --------------------------------

  it('Salesforce - Verify Health - US', () => {
    CheckHealth('https://salesforce-us.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - US (Sandbox)', () => {
    CheckHealth('https://salesforce-us.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - CA', () => {
    CheckHealth('https://salesforce-ca.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - CA (Sandbox)', () => {
    CheckHealth('https://salesforce-ca.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - EU', () => {
    CheckHealth('https://salesforce-eu.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - EU (Sandbox)', () => {
    CheckHealth('https://salesforce-eu.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - AU', () => {
    CheckHealth('https://salesforce-au.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Salesforce - Verify Health - AU (Sandbox)', () => {
    CheckHealth('https://salesforce-au.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  // -------------------------------- Namely --------------------------------

  it('Namely - Verify Health - US', () => {
    CheckHealth('https://namely-us.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - US (Sandbox)', () => {
    CheckHealth('https://namely-us.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - CA', () => {
    CheckHealth('https://namely-ca.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - CA (Sandbox)', () => {
    CheckHealth('https://namely-ca.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - EU', () => {
    CheckHealth('https://namely-eu.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - EU (Sandbox)', () => {
    CheckHealth('https://namely-eu.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - AU', () => {
    CheckHealth('https://namely-au.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('Namely - Verify Health - AU (Sandbox)', () => {
    CheckHealth('https://namely-au.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  // -------------------------------- ADP --------------------------------

  it('ADP - Verify Health - US', () => {
    CheckHealth('https://adp-us.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - US (Sandbox)', () => {
    CheckHealth('https://adp-us.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - CA', () => {
    CheckHealth('https://adp-ca.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - CA (Sandbox)', () => {
    CheckHealth('https://adp-ca.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - EU', () => {
    CheckHealth('https://adp-eu.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - EU (Sandbox)', () => {
    CheckHealth('https://adp-eu.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - AU', () => {
    CheckHealth('https://adp-au.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  it('ADP - Verify Health - AU (Sandbox)', () => {
    CheckHealth('https://adp-au.sandbox.absorb.ad:4443/api/health', jsonPropertyName1);
  });

  // -------------------------------- AQS --------------------------------

  it('AQS - Verify Health - US (Prod)', () => {
    CheckHealth('https://aqs-us.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - US (Sand)', () => {
    CheckHealth('https://aqs-us.sandbox.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - CA (Prod)', () => {
    CheckHealth('https://aqs-ca.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - CA (Sand)', () => {
    CheckHealth('https://aqs-ca.sandbox.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - EU (Prod)', () => {
    CheckHealth('https://aqs-eu.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - EU (Sand)', () => {
    CheckHealth('https://aqs-eu.sandbox.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - AU (Prod)', () => {
    CheckHealth('https://aqs-au.absorb.ad:4443/health', jsonPropertyName2);
  });

  it('AQS - Verify Health - AU (Prod)', () => {
    CheckHealth('https://aqs-au.sandbox.absorb.ad:4443/health', jsonPropertyName2);
  });

  // -------------------------------- CPP --------------------------------

  it('CPP - Verify Health - US (Prod Library)', () => {
    CheckHealth('https://contentpartner.myabsorb.com/health', null, strStatusText);
  });

  it('CPP - Verify Health - US (Sand Library)', () => {
    CheckHealth('https://contentpartner-sandbox.myabsorb.com/health', null, strStatusText);
  });

  it('CPP - Verify Health - US (Prod Licensing)', () => {
    CheckHealth('https://cppl.myabsorb.com/health', null, strStatusText);
  });

  it('CPP - Verify Health - US (Sand Licensing)', () => {
    CheckHealth('https://cppl-sandbox.myabsorb.com/health', null, strStatusText);
  });

  it('CPP - Verify Health - US (Prod Management)', () => {
    CheckHealth('https://cppm.myabsorb.com/health', null, strStatusText);
  });

  it('CPP - Verify Health - US (Sand Management)', () => {
    CheckHealth('https://cppm-sandbox.myabsorb.com/health', null, strStatusText);
  });

  it('CPP - Verify Health - CA (Prod Library)', () => {
    CheckHealth('https://contentpartner.myabsorb.ca/health', null, strStatusText);
  });

  it('CPP - Verify Health - CA (Sand Library)', () => {
    CheckHealth('https://contentpartner-sandbox.myabsorb.ca/health', null, strStatusText);
  });

  it('CPP - Verify Health - CA (Prod Licensing)', () => {
    CheckHealth('https://cppl.myabsorb.ca/health', null, strStatusText);
  });

  it('CPP - Verify Health - CA (Sand Licensing)', () => {
    CheckHealth('https://cppl-sandbox.myabsorb.ca/health', null, strStatusText);
  });

  it('CPP - Verify Health - CA (Prod Management)', () => {
    CheckHealth('https://cppm.myabsorb.ca/health', null, strStatusText);
  });

  it('CPP - Verify Health - CA (Sand Management)', () => {
    CheckHealth('https://cppm-sandbox.myabsorb.ca/health', null, strStatusText);
  });

  it('CPP - Verify Health - EU (Prod Library)', () => {
    CheckHealth('https://contentpartner.myabsorb.eu/health', null, strStatusText);
  });

  it('CPP - Verify Health - EU (Sand Library)', () => {
    CheckHealth('https://contentpartner-sandbox.myabsorb.eu/health', null, strStatusText);
  });

  it('CPP - Verify Health - EU (Prod Licensing)', () => {
    CheckHealth('https://cppl.myabsorb.eu/health', null, strStatusText);
  });

  it('CPP - Verify Health - EU (Sand Licensing)', () => {
    CheckHealth('https://cppl-sandbox.myabsorb.eu/health', null, strStatusText);
  });

  it('CPP - Verify Health - EU (Prod Management)', () => {
    CheckHealth('https://cppm.myabsorb.eu/health', null, strStatusText);
  });

  it('CPP - Verify Health - EU (Sand Management)', () => {
    CheckHealth('https://cppm-sandbox.myabsorb.eu/health', null, strStatusText);
  });

  it('CPP - Verify Health - AU (Prod Library)', () => {
    CheckHealth('https://contentpartner.myabsorb.com.au/health', null, strStatusText);
  });

  it('CPP - Verify Health - AU (Sand Library)', () => {
    CheckHealth('https://contentpartner-sandbox.myabsorb.com.au/health', null, strStatusText);
  });

  it('CPP - Verify Health - AU (Prod Licensing)', () => {
    CheckHealth('https://cppl.myabsorb.com.au/health', null, strStatusText);
  });

  it('CPP - Verify Health - AU (Sand Licensing)', () => {
    CheckHealth('https://cppl-sandbox.myabsorb.com.au/health', null, strStatusText);
  });

  it('CPP - Verify Health - AU (Prod Management)', () => {
    CheckHealth('https://cppm.myabsorb.com.au/health', null, strStatusText);
  });

  it('CPP - Verify Health - AU (Prod Management)', () => {
    CheckHealth('https://cppm-sandbox.myabsorb.com.au/health', null, strStatusText);
  });

  // -------------------------------- CONVERSATIONS --------------------------------

  it('CONVERSATIONS - Verify Health - US (Prod)', () => {
    CheckHealth('https://conversations-us.absorb.ad/health', null, strStatusText);
  });

  it('CONVERSATIONS - Verify Health - CA (Prod)', () => {
    CheckHealth('https://conversations-ca.absorb.ad/health', null, strStatusText);
  });

  it('CONVERSATIONS - Verify Health - EU (Prod)', () => {
    CheckHealth('https://conversations-eu.absorb.ad/health', null, strStatusText);
  });

  it('CONVERSATIONS - Verify Health - AU (Prod)', () => {
    CheckHealth('https://conversations-au.absorb.ad/health', null, strStatusText);
  });
})