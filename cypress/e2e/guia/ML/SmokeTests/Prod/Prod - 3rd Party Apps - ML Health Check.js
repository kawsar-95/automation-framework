//These test steps check the endpoints seen on the 'ML Services Health Check' 
//Grafana page: https://status.absorb.ad/d/ehRXB51Mz/mlservice?orgId=1&from=now-5m&to=now&var-Datasource=Prometheus_US

import {miscData} from "../../../../../../helpers/TestData/Misc/misc"

const jsonPropertyName = 'message';
const strExpectedStatus = 'alive';

function CheckHealth(strURL){
  cy.request({method: "GET", url: strURL,}).then((response) => {
    if ((response.body[jsonPropertyName])===strExpectedStatus){
      expect(response.body[jsonPropertyName]).to.eql(strExpectedStatus, "ML Service is up");
      cy.addContext(`${strURL} ML Service is alive`); //Log pass
    }
    else {
      cy.addContext(`${strURL} ML Service is down, status was not alive`); //Log failure
      expect(response.body[jsonPropertyName]).to.eql(strExpectedStatus); 
    }
  })
}

describe('Prod - 3rd Party Apps - ML Health Check', function(){

  // -------------------------------- ML Services --------------------------------

  it('ML Service - Verify Health - US', () => {
    CheckHealth(miscData.mLServiceUS);
  });

  it('ML Service - Verify Health - CA', () => {
    CheckHealth(miscData.mLServiceCA);
  });

  it('ML Service - Verify Health - EU', () => {
    CheckHealth(miscData.mLServiceEU);
  });

  it('ML Service - Verify Health - AU', () => {
    CheckHealth(miscData.mLServiceAU);
  });

  it('ML Service - Verify Health - US Sandbox', () => {
    CheckHealth(miscData.mLServiceUSsandbox);
  });

  //Check internal environments
  it('ML Service - Verify Health - UAT1', () => {
    CheckHealth(miscData.mLServiceUAT1);
  });

  it('ML Service - Verify Health - 5.qa', () => {
    CheckHealth(miscData.mLService5qa);
  });

  it('ML Service - Verify Health - Secondary', () => {
    CheckHealth(miscData.mLServiceSecondary);
  });

  it('ML Service - Verify Health - Main', () => {
    CheckHealth(miscData.mLServiceQaMain);
  });

})

 