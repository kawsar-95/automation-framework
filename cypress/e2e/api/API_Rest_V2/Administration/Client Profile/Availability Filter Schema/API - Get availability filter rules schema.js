



describe("Availability Filter Schema Test", () => {
  it("GET - Get availability filter rules schema", () => {

    cy.getApiV2("/api/rest/v2/admin/my-client-profile/availability-filter-schema", null).then((response) => {
      expect(response.status).to.be.eq(200)
      expect(response.duration).to.be.below(3000)


    })
  })
})