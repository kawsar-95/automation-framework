import arBasePage from "../../AR/ARBasePage";
import { userDetails } from '../../TestData/users/UserDetails'

export const socialUsers = {
    "username": new arBasePage().getTimeStamp() + 'USER-'
}

export const conversations = {
    "messageFromLearner": "Test Message",
    "messageFromLearner2": `Message from ${userDetails.username2}`,
    "messageFromLearner3": `Message from ${userDetails.username3}`
}

export const comments = {
    "commentFromLearner": 'Comment From Learner 1',
    "commentFromLearner2": 'Comment From Learner 2',
    "commentFromLearner3": 'Comment From Learner 3',
}


