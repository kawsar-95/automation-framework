import { courses } from "../../../../../helpers/TestData/Courses/courses";



let url = "/categories/" + courses.category_id_apiv15
describe("API - Category ID Test", () => {
    
     it("GET - Category ID", () => {
    
            cy.getApiV15(url, null).then((response) => {
                             expect(response.status).to.be.eq(200)
                        })
                     })
    })
