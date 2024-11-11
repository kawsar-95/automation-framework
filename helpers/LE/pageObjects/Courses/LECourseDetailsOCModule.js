import LEBasePage from '../../LEBasePage'
import {  courseUploadSection } from '../../../../helpers/TestData/Courses/oc'
import dayjs from 'dayjs'

export default new class LECourseDetailsOCModule extends LEBasePage {

  //Prerequisites Section
  getVerifyPrerequisitesHeader() {
    return '[class*="course-prerequisites-module__prerequisite_header"]'
  }
  //Course Content Section

    getChapterContainer() {
      return '[class*="course-discovery-chapters-module__chapters_container"]'
    }

    getChapterTitle() {
           return `[class*="course-discovery-details-panel-module__tabs_container"] [class*="course-discovery-chapter-module__chapter_title"]`
    }

    getNumLessons() {
      return '[class*="Component-small_pill"]'
    }

    getLessonContainer() {
      return '[data-name="lesson-panel"]'
    }

    getLessonName() {
     return '[class*="panel-module__name"]'
    
    }

    getLessonHeader() {
      return '[class*="lesson-panel-module__panel_header"]'
    }

    getLessonDescription() {
      return '[class*="sanitized-html-module__sanitized_container"]'
    }

    getLessonBtn() {
      return '[class*="action-button-module__title"]'
    }
    getStartBtn(){
      return '[class*="course-discovery-start-button-module"]'
    }
    getEllipsesBtn() {
      return `[data-name*="course-discovery-hollow-button-module__btn"]`
    }

    getLessonContentName(){
      return '[class*="course-player-lesson-item-module__name"]'
    }

    getLessonContentContainer(){
      return '[class*="course-player-sidebar-module__sidebar"]'
    }

    getCourseContentSelect(name){
      cy.get(this.getLessonBtn()).contains(name).parents(this.getLessonHeader()).click()
    }

    getClickQuizBtn(name){
      cy.get('[class="btn button-module__btn___svB4M"]').contains(name).click()

    }

    getClickByCourseName(name){
      cy.get('[class*="card-module__name"]').contains(name).click()
    }
//Elements associated with Course discovery Modal (Next Gen LE) when course is started
    getCourseViewBtn(){
      return '[class*="btn course-discovery-start-button-module"]'
    }

    getOverflowBtn() {
      return `[class*="course-discovery-overflow-menu-module__open_btn"]`
    }

    //Pass lesson name, status that the button should be (ex. complete or start), true if you want it to be clicked on
    getCourseLessonActionBtn(name, status, click = false) {
      cy.get(this.getLessonName()).contains(name).parents(this.getLessonHeader()).within(() => {
        if (click === true) {
          cy.get('[aria-disabled*="false"]').should('exist', 'contain', status, {timeout:10000}).click()
        } else {
          cy.get('[aria-disabled*="false"]').should('exist', 'contain', status, {timeout:10000})
        }
     })
    }
    

    //Pass upload name to click the upload button associated with it
    getCourseUploadActionBtnThenClick(name) {
      cy.get(this.getLessonName()).contains(name).parents('[class*="course-upload-module__panel_header"]').within(() => {
        cy.get('[class*="action-button-module__title"]').click()
     })
    }

  getCourseContentUpload(){
      cy.get(this.getElementByAriaLabelAttribute("View GUIA OC Upload Label"))
      .should('have.text',courseUploadSection.uploadLabel).click()
  }
  getCourseLessonUploadActionBtn(name, status, click = false) {
      cy.get(this.getLessonName()).contains(name).then(() => {
        if (click === true) {
          cy.get('button[aria-disabled*="false"]').should('exist', 'contain', status, {timeout:10000}).click()
        } else {
          cy.get('button[aria-disabled*="false"]').should('exist', 'contain', status, {timeout:10000})
        }
     })
    }

    getCourseContentUploadM(){
      return '[class*="online-course-syllabus-module__course"]'
    }

    //----- For Uploads Section -----//

    getUploadInstructions() {
      return '[class*="course-uploads-module__instructions"]'
    }

    getUploadStatus() {
      return '[class*="course-upload__status"]'
    }

    getCertificateDateIssued() {
      return '[class*="course-upload__upload_date_issued"]'
    }

    getCertificateExpiryDate() {
      return '[class*="course-upload__upload_expiry_date"]'
    }

    getCertificateIssuer() {
      return '[class*="course-upload__issuer"]'
    }


   //------ For Leaderboard Points Section ------//
    getLeaderboardPointsModuleTitle(){
      return `[class*="course-points-module__title"]`
    }

    getLeaderboardPointsModulePoints(){
      return `[class*="course-points-module__points"]`
    }

    
    getTabBtn(){
      return 'button[class*="horizontal-tab-list-module__tab_btn"]'
    }
    //--------- For Online Courses Modal ------------//
    getLessonNavBtn() {
      return `[role="dialog"] [class*="horizontal-tab-module__tab"]`
    }
  
    getRateCourseBtn() {
        return '[class*="_rate_course_btn"]'
    }

    getCourseDiscoveryModalCourseName() {
      return `[data-name="course-discovery-banner"] [class*="course-discovery-banner-module__title___"]`
    }

    getCourseDiscoveryActionBtn() {
      return `button[data-name="course-discovery-start-button"]`
    }

    /**
     * Pass Course name, status that the button should be (ex. complete or start), true if you want it to be clicked on
     * @param {String} name 
     * @param {String} status 
     * @param {boolean} click 
     */
    getCourseDiscoveryAction(name, status, click = false) {
      cy.get(this.getCourseDiscoveryModalCourseName()).contains(name).parents('[data-name="course-discovery-banner"]').within(()=>{
        if (click === true) {
          cy.get(this.getCourseDiscoveryActionBtn()).should('exist', 'contain', status, {timeout:10000}).and('have.attr','aria-disabled','false').click({force:true})
        } else {
          cy.get(this.getCourseDiscoveryActionBtn()).should('exist', 'contain', status, {timeout:10000})
        }
      })
    }

    getSingleStarRating() {
        return '[class*="_single_star_rating"]'
    }

    getRatingStarBtn() {
        return 'label[class*="rating-module__star"]'
    }

    getCommentTextArea() {
        return '[name="commentText"]'
    }

    getRatingLabel() {
        return 'span[class*="_rating_label"]'
    }

    getCommentContainer() {
        return '[class*="comment_container"]'
    }

	getCommentsContainer() {
        return '[class*="comments_container"]'
    }

    getCommentAuthor() {
        return '[class*="comment__author"]'
    }

	getAuthorAvatar() {
		return '[class*="_avatar_thumbnail"]'
	}

	getRepliesContainer() {
		return '[class*="_replies_container"]'
	}

    getReplyUploadFile() {
        return '[class*="_comments_container"] input[type="file"]'
    }

    getReplyBtn() {
        return '[aria-label*="Reply"]'
    }

	getReplyTextArea() {
		return '[class*="_comments_container"] [name="commentText"]'
	}

	getShowRepliesBtn() {
		return '[title="Show replies"]'
	}

	getHideRepliesBtn() {
		return '[title="Hide replies"]'
	}

	getCommentOptionsBtn() {
		return '[title="Comment Options"]'
	}

	getEditCommentBtn() {
		return '[title="Edit Comment"]'
	}

	getDeleteCommentBtn() {
		return '[title="Delete Comment"]'
	}

	getAttachmentLink() {
		return 'a[class*="_attachment_link"]'
	}

	getCancelBtn() {
		return '[class*="_cancel_button"]'
	}

	getFollowMessage() {
		return '[class*="_follow_message"]'
	}

	getFollowBtn() {
		return '[class*="_follow_btn"]'
	}

	followPost(username) {
		cy.get(this.getCommentAuthor()).contains(username).parents(this.getCommentsContainer()).first().within(() => {
			cy.get(this.getFollowMessage()).invoke('text').then($text => {
				if($text === 'Follow'){
					cy.get(this.getFollowBtn()).click()
					cy.get(this.getFollowMessage()).should('have.text', 'Unfollow')
				} else {
					cy.get(this.getFollowMessage()).should('have.text', 'Unfollow')
				}
			})
		})
	}

	unfollowPost(username) {
		cy.get(this.getCommentAuthor()).contains(username).parents(this.getCommentsContainer()).first().within(() => {
			cy.get(this.getFollowMessage()).invoke('text').then($text => {
				if($text === 'Unfollow'){
					cy.get(this.getFollowBtn()).click()
					cy.get(this.getFollowMessage()).should('have.text', 'Follow')
				} else {
					cy.get(this.getFollowMessage()).should('have.text', 'Follow')
				}
			})
		})
	}

	getVoteMessage() {
		return '[class*="_vote_message"]'
	}

	getVoteBtn() {
		return '[class*="__vote_btn"]'
	}

	markAsHelpful(username, title = 'Mark as helpful') {
		cy.get(this.getCommentAuthor()).contains(username).parents(this.getCommentsContainer()).first().within(() => {
			cy.get(this.getVoteBtn()).invoke('attr', 'title').then(($value) => {
				if (title === $value) {
					cy.get(this.getVoteMessage()).should('have.text', 'Helpful?')
					cy.get(this.getVoteBtn()).click()
					cy.get(this.getVoteMessage()).should('have.text', "")
				} else {
					cy.get(this.getVoteMessage()).should('have.text', "")
				}
			})
		})
	}

	removeMarkAsHelpful(username, title = 'Remove Mark as helpful') {
		cy.get(this.getCommentAuthor()).contains(username).parents(this.getCommentsContainer()).first().within(() => {
			cy.get(this.getVoteBtn()).invoke('attr', 'title').then(($value) => {
				if (title === $value) {
					cy.get(this.getVoteMessage()).should('have.text', '')
					cy.get(this.getVoteBtn()).click()
					cy.get(this.getVoteMessage()).should('have.text', 'Helpful?')
				} else {
					cy.get(this.getVoteMessage()).should('have.text', 'Helpful?')
				}
			})
		})
	}

	getSocialProfileFlyoverContainer() {
		return '[class*="social-profile-flyover-module__container"]'
	}

  getWarningLabel() {
    return '[class*="_warning_label"]'
  }

  verifyExpirationDate(date) {
    cy.get(this.getWarningLabel()).should('contain', dayjs(date).format('dddd')).and('contain', dayjs(date).format('MMMM'))
        .and('contain', dayjs(date).format('D')).and('contain', dayjs(date).format('YYYY'))
}
}
