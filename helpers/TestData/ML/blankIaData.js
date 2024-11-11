export const BlankScreenQueriesIA = {
    // Format is -> report: [test query, expected report/action, expected filter]
    course: [["average rating of 2.2 courses", "Courses", [{ filter: "Average Rating Equals 2.2", match: "exact" }]]],
};
