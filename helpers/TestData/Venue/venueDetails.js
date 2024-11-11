import arBasePage from '../../AR/ARBasePage'

const name = "GUIA-CED-Venue-" + new arBasePage().getTimeStamp()
const name2 = "GUIA-CED-Venue2-" + new arBasePage().getTimeStamp()

export const venues = {
    "venue01Name": "GUIA - Venue01",
    "venue02Name": "GUIA - Venue02",
    "teamsVenue01Name": "GUIA - Teams Venue 01",
    "zoomVenue01Name": "GUIA - Zoom Venue 01"
}

export const venueDetails = {
    "venueName" : name, 
    "venueName2" : name2, 
    "venueNameEdited" : name + new arBasePage().getAppendText(),
    "description" : "GUIA-CED-Venue-Description",
    "address" : "GUIA-CED-Venue-Address",
    "address2" : "GUIA-CED-Venue-2-Address",
    "maxClassSize" : "5",
    "maxClassSize2" : "10",
    "city" : "Calgary",
    "city2" : "Montgomery",
    "zip" : "T1T1T1",
    "zip2" : "36043",
    "country" : "Canada",
    "country2" : "United States",
    "province" : "Alberta",
    "province2" : "Alabama",
    "phoneNumber": "111-222-3344",
    "phoneNumber2": "987-654-3232",
    "venueNames": []
}

export const venueTypes = {
    "classroom": "Classroom",
    "connectPro": "Connect Pro", 
    "goToMeeting": "GoToMeeting", 
    "url": "Url", 
    "zoomMeeting": "Zoom Meeting", 
    "zoomWebinar": "Zoom Webinar", 
    "teamsMeeting": "Teams Meeting", 
    "webEx": "WebEx"
}

export const venueLinks = {
    "teamsLink": "https://teams.microsoft.com/",
    "zoomMeetingLink": "https://absorblms.zoom.us/"
}
