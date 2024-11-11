export const QueriesIA = {
    // Format is -> report: [test query, expected report/action, expected filter]
    user: [
        ["users in department 'zzdeptksl'", "Users", [{ filter: ".* Departments Like 'zzdept.*'", match: "regex" }]],
        ["users in department 'Trending department'", "Users", [{ filter: ".* Departments Like 'Trending .*'", match: "regex" }]],
        ["'create user'", "Add User"],
        ["edit john parker", "Edit User", [{ filter: ".* Users Like '(John Parker|John|Parker|john parker|john|parker|John parker|john Parker)'", match: "regex" }]],
        ["view users 'Rahim'", "Users", [{ filter: "Full Name Contains Rahim", match: "exact" }]],
        ["view users with firstname 'Rahim'", "Users", [{ filter: "First Name Contains Rahim", match: "exact" }]],
        ["rachel fisher", "Users", [{ filter: "Full Name Contains [rR]achel", match: "regex" }]],
        ["Users hired before June 15 2020", "Users", [{ filter: "Date Hired Before .*", match: "regex" }]],
        ["Inactive users", "Users", [{ filter: "Status Equals Inactive", match: "exact" }]],
        ["Users who have logged in within the past week", "Users", [{ filter: "Last Logged In Between .*", match: "regex" }]],
        ["message 'rahim bhaloo'", "Message User", [{ filter: ".* Users Like 'rahim bhaloo'", match: "regex" }]],
        ["Reset Ian's password", "Reset Password", [{ filter: ".* Users Like 'Ian'", match: "regex" }]],
        ["Delete 'john'", "Delete User", [{ filter: ".* Users Like '[jJ]ohn'", match: "regex" }]],
    ],
    collaboration: [
        [
            "collaboration 'Test collaboration 1' and collaboration 'collaboration 2' but not collaboration 'Collaborations 3'",
            "Collaboration",
            [
                { filter: "Name Does Not Contain Collaborations 3", match: "exact" },
                { filter: "Name Contains Test collaboration 1", match: "exact" },
                { filter: "Name Contains collaboration 2", match: "exact" },
            ],
        ],
        ["Find collaboration report", "Collaboration"],
        ["Collaborations created this month", "Collaboration", [{ filter: "Date Added Between .*", match: "regex" }]],
        ["Collaborations created this week", "Collaboration", [{ filter: "Date Added Between .*", match: "regex" }]],
        ["Active collaborations", "Collaboration", [{ filter: "Status Equals Active", match: "exact" }]],
        [
            "Collaborations created this month named 'dogs'",
            "Collaboration",
            [
                { filter: "Date Added Between .*", match: "regex" },
                { filter: "Name Contains dogs", match: "exact" },
            ],
        ],
    ],
    collaboration_activity: [
        ["Collaboration activities created in the last 90 days", "Collaboration Activity", [{ filter: "Date Added Between .*", match: "regex" }]],
        [
            "Collaboration activity for username 'rahim.bhaloo' or username 'sysadmin-dup'",
            "Collaboration Activity",
            [
                { filter: "Username Contains rahim.bhaloo", match: "exact" },
                { filter: "Username Contains sysadmin-dup", match: "exact" },
            ],
        ],

        [
            "Collaboration activity for username 'rahim.bhaloo' or username 'sysadmin-dup'",
            "Collaboration Activity",
            [
                { filter: "Username Contains rahim.bhaloo", match: "exact" },
                { filter: "Username Contains sysadmin-dup", match: "exact" },
            ],
        ],
        [
            "Collaboration activity for Calgary or Edmonton",
            "Collaboration Activity",
            [
                { filter: "City Contains Calgary", match: "exact" },
                { filter: "City Contains Edmonton", match: "exact" },
            ],
        ],
        [
            "Collaboration activity for collaboration 'Test collaboration 1' or collaboration 'collaboration 2'",
            "Collaboration Activity",
            [
                { filter: "Collaboration Contains Test collaboration 1", match: "exact" },
                { filter: "Collaboration Contains collaboration 2", match: "exact" },
            ],
        ],
        ["Collaboration activity in country 'Canada'", "Collaboration Activity", [{ filter: "Country Contains Canada", match: "exact" }]],
        ["Collaboration activity in province 'Alberta'", "Collaboration Activity", [{ filter: "State/Province Contains Alberta", match: "exact" }]],
        ["Collaboration activity in location 'Walmart Deerfoot Meadows'", "Collaboration Activity", [{ filter: "Location Contains Walmart Deerfoot Meadows", match: "exact" }]],
    ],
    role: [
        ["edit roles 'teacher'", "Edit Role", [{ filter: ".* Roles Like 'teacher'", match: "regex" }]],
        ["Create role", "Add Role"],
        ["Roles added last Jan 1", "Roles", [{ filter: "Date Added Between .*", match: "regex" }]],
        ["Roles edited on Jan 1", "Roles", [{ filter: "Date Edited Between .*", match: "regex" }]],
        ["Roles edited last year", "Roles", [{ filter: "Date Edited Between .*", match: "regex" }]],
        ["Roles edited last Jan 1", "Roles", [{ filter: "Date Edited Between .*", match: "regex" }]],
        ["roles with id: 916d7c2a-0275-4829-960c-87382ce9ab13", "Roles", [{ filter: "ID Equals 916d7c2a-0275-4829-960c-87382ce9ab13", match: "exact" }]],
    ],
    course: [
        ["'biology'", "Courses", [{ filter: "Name Contains biology", match: "exact" }]],
        ["view courses in Spanish", "Courses", [{ filter: ".*Language Contains Spanish", match: "regex" }]],
        ["view courses in French", "Courses", [{ filter: ".*Language Contains French", match: "regex" }]],
    ],
    course_activity: [
        ["course activity for name '052 - transcription test'", "Course Activity", [{ filter: ".* Courses Like '052 - transcri.*", match: "regex" }]],
        [
            "course activity for name 'IA Course' in Toronto",
            "Course Activity",
            [
                { filter: "City Contains Toronto", match: "exact" },
                { filter: ".* Courses Like 'IA Course'", match: "regex" },
            ],
        ],
        [
            "course activity for name 'IA Course' with job title 'cop' or job title 'free'",
            "Course Activity",
            [
                { filter: "Job Title Contains cop", match: "exact" },
                { filter: "Job Title Contains free", match: "exact" },
                { filter: ".* Courses Like 'IA Course'", match: "regex" },
            ],
        ],
    ],
};
