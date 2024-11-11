
export default new class adminContextMenu {

    btnAddOnlineCourse() {
        return `[data-name="create-online-course-context-button"]`;
    }

    btnAddInstructorLed() {
        return `[data-name="create-instructor-led-course-context-button"]`;
    }

    btnAddCourseBundle() {
        return `[data-name="create-course-bundle-context-button"]`;
    }

    btnAddCurriculum() {
        return `[data-name="create-curriculum-context-button"]`;
    }

    btnEditCourse() {
        return `[data-name="edit-course-context-button"]`;
    }

    btnCancel() {
        return `[data-name="cancel"]`;
    }

    btnPublishCourse() {
        return `[data-name="submit"]`;
    }

    btnContinue() {
        return `[data-name="confirm"]`;
    }
    
    btnEditCourse() {
        return `[data-name="edit-course-context-button"]`;
    }

    btnCourseEnrollments() {
        return `[data-name="course-enrollments-context-button"]`;
    }

    btnReenrollUser() {
        return `[data-name="re-enroll-user-context-button"]`;
    }

    btnUnenrollUser() {
        return `[data-name="unenroll-user-single-context-button"]`;
    }

}