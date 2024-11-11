import arBasePage from "../../ARBasePage";

export default new (class AREditClientDefaultsPage extends arBasePage {
    getDefaultLeaderboardPointValuesHelpTxt() {
        return '[class="subsection grey"] [class*="help-text"]'
    }

    getDefaultLeaderboardPointValuesHelpMsg() {
        return 'Points are awarded to learners upon completing a course (of the specified type), submitting a comment, or earning a competency. Changes to values do not affect points that have already been awarded.'
    }

    getCompleteOnlineCoursePoints() {
        return '[name="UserActivityPointAllocations.CompleteOnlineCoursePoints"]'
    }

    getCompleteCurriculumCoursePoints() {
        return '[name="UserActivityPointAllocations.CompleteCurriculumCoursePoints"]'
    }

    getCompleteInstructorLedCoursePoints() {
        return '[name="UserActivityPointAllocations.CompleteInstructorLedCoursePoints"]'
    }

    getEarnCompetencyPoints() {
        return '[name="UserActivityPointAllocations.EarnCompetencyPoints"]'
    }

    getCommentPoints() {
        return '[name="UserActivityPointAllocations.CommentPoints"]'
    }

    getShowLeaderboardPointsInCourseDetailsToggleMsg() {
        return 'Turning this feature on will show leaderboard points awarded inside course details. 0 points awarded will not be shown.'
    }
})();
