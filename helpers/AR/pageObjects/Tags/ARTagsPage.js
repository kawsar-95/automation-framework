import arBasePage from "../../ARBasePage";

export default new class ARTagsPage extends arBasePage {

  // Inherits elements from ARBasePage
  getCoursesSingleContextBtn() {
    return '[data-name="tag-courses-single-context-button"]'
  }
};
