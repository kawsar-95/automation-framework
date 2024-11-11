import arDashboardPage from "../../AR/pageObjects/Dashboard/ARDashboardPage";
import MLHelper from "../Helpers";

export const validate_test_case = (test_case) => {
    let [query, report, filters] = test_case;
    cy.get(arDashboardPage.getIntelligentAssistTxtF()).clear();
    MLHelper.getShortWait();
    cy.get(arDashboardPage.getIntelligentAssistTxtF()).type(query);
    MLHelper.getShortWait();
    MLHelper.getShortWait();
    cy.get(`[data-name=search-suggestions] [data-name=search-suggestion-status]`).should("exist");
    MLHelper.getShortWait();

    var res_found = false;
    return cy
        .get(arDashboardPage.getIntelligentAssistRes())
        .get(arDashboardPage.getListItem())
        .each(($result) => {
            let res_title = $result.find(arDashboardPage.getIntelligentAssistResTitle()).text();
            let res_filters = $result
                .find(arDashboardPage.getIntelligentAssistResFilterList())
                .children()
                .toArray()
                .map((child_filter) => child_filter.innerText);
            if (res_title === report) {
                console.log(isin(filters, res_filters));
                // let res_filters_sorted = res_filters_text.sort();

                // if (res_filters_sorted.length === filters_sorted.length && JSON.stringify(res_filters_sorted) === JSON.stringify(filters_sorted)) {
                if (isin(filters, res_filters)) {
                    res_found = true;
                    return false; // break loop
                }
            }
        })
        .then(() => {
            let log_str = `Test Passed: ${res_found}, Query: ${query}, Report: ${report}`;
            if (filters !== "") {
                log_str += `, Filter: ${JSON.stringify(filters)}`;
            }
            console.log(log_str);
            expect(res_found).to.be.true;
        });
};

const isin = function (expected_filters, got_filters) {
    if (typeof expected_filters === "undefined") return true; // if expected filters are not specified, don't check
    return expected_filters.every((expected_filter) => {
        if (expected_filter["match"] === "regex") {
            return got_filters.some((got_filter) => got_filter.match(expected_filter["filter"]) !== null);
            // return true;
        } else if (expected_filter["match"] === "exact") {
            // return true;
            return got_filters.includes(expected_filter["filter"]);
        } else {
            throw new Error(`Expected match type ${expected_filter["type"]} to be 'regex' or 'exact' but got '${expected_filter["type"]}' instead.`);
        }
    });
};
