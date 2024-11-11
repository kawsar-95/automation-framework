
export default new class adminAbsorbUtilities {

    global() {
        return `[href="/hangfire-Global"]`;
    }

    headerRecurringjobs() {
        return `[href="/hangfire-Global/recurring"]`;
    }

    itemsPerPage500() {
        return `[href="?from=0&count=500"]`;
    }

    trainTopicModelingForAllDatabasesJob() {
        return `[class*="js-jobs-list-row hover"]`;
    }

    btnTriggerNow() {
        return `[data-url="/hangfire-Global/recurring/trigger"]`;
    }

    headerJobs() {
        return `[href="/hangfire-Global/jobs/enqueued"]`;
    }

    headerJobsSucceeded() {
        return `[href="/hangfire-Global/jobs/succeeded"]`;
    }

    headerJobsSucceededJobDetails() {
        return `[href*="/hangfire-Global/jobs/details"]`;
    }


}