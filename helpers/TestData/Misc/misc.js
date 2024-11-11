import BasePage from "../../BasePage";

export const miscData = {

    "resource_image_folder_path": "../../helpers/TestData/resources/images/",
    "resource_pdf_folder_path": "../../helpers/TestData/resources/pdfs/",
    "resource_video_folder_path": "../../helpers/TestData/resources/videos/",
    "billboard_01_filename": "billboard (tasty).jpg",
    "switching_to_absorb_img_url": "https://www.absorblms.com/uploads/wp-content/uploads/2018/10/switching-to-absorb.jpg",
    //"switching_to_absorb_filename": "switching-to-absorb.jpg", - delete
    "switching_to_absorb_filename": "image Absorb logo small.png",

    "public_tile_names": ['FAQs', 'Latest News', 'Enrollment Key', 'Facebook', 'Twitter'],
    "background_image_alignments": [['Top', 'Center', 'Bottom'], ['Left', 'Center', 'Right']],

    "resource_global_01": "GUIAuto-Global Resources",


    "poll_01_title": "One Poll Two Poll Red Poll",
    "poll_02_title": "Where is the North Pole?",

    "faq_01_title": "FAQ U",
    "faq_02_title": "FAQ U 2",
    "faq_03_title": "What the FAQ?",

    "news_art_01_title": "GUIA NEWS ART 01 (DO NOT DELETE)",
    "news_art_01_desc": "GUIA NEWS ART 01 (DO NOT DELETE)",

    "news_art_02_title": "GUIA NEWS ART 02 (DO NOT DELETE)",
    "news_art_02_desc": "GUIA NEWS ART 02 (DO NOT DELETE)",

    "news_art_03_title": "Orange Shirt Day",
    "new_art_03_desc": "Orange Shirt Day",

    "news_art_04_title": "GUIA NEWS ART 03 (DO NOT DELETE)",
    "news_art_04_desc": "GUIA NEWS ART 03 (DO NOT DELETE)",

    "auto_tag1" : "Auto_Tag1",
    "auto_tag3": "- Free",
    "auto_tag2": "- Filter",


    "remote_vide0_url": "https://www.youtube.com/watch?v=4pkrmuXatoo",
    //"remote_image0_url": "https://www.google.ca",
    "remote_image0_url": "https://waytocanada.ca/uploads/1648185654_places.jpg",
    "competency_01": "GUIAuto - Competency - 01",
    "competency_02": "GUIAuto - Competency - 02",
    "competency_03": "GUIAuto - Competency - 03",
    "competency_level": 1,

    "field_required_error": "Field is required.",
    "invalid_chars_error": "Field contains invalid characters.",
    "whitespace_chars_error": "Must not contain only whitespace characters",
    "negative_chars_error": "Field must be greater than or equal to 0.",
    "char_0_error": "Must contain 1 or more characters",
    "char_255_error": "Field cannot be more than 255 characters.",
    "char_450_error": "Field cannot be more than 450 characters.",
    "char_455_error": "Field cannot be more than 455 characters.",
    "char_850_error": "Field cannot be more than 850 characters.",
    "char_1000_error": "Field must be less than or equal to 100.",
    "char_500_error": "Field must be less than or equal to 500.",
    "char_4000_error": "Field cannot be more than 4000 characters.",
    "le_char_255_error": "Must contain 255 or fewer characters",
    "le_char_4000_error": "Must contain 4000 or fewer characters",

    "a_collaboration_name": "A - GUIA Collaboration",
    "a_collaboration_description": "This is the description for the A - GUIA Collaboration.",
    "b_collaboration_name": "B - GUIA Collaboration",
    "c_collaboration_name": "C - GUIA Collaboration",
    "d_collaboration_name": "D - GUIA Collaboration",
    "e_collaboration_name": "E - GUIA Collaboration",
    "f_collaboration_name": "F - GUIA Collaboration",
    "g_collaboration_name": "G - GUIA Collaboration",
    "h_collaboration_name": "H - GUIA Collaboration",
    "i_collaboration_name": "I - GUIA Collaboration",
    "j_collaboration_name": "J - GUIA Collaboration",
    "k_collaboration_name": "K - GUIA Collaboration",
    "l_collaboration_name": "L - GUIA Collaboration",

    "guia_credit_1_name": "GUIA-CREDIT-1",
    "guia_credit_2_name": "GUIA-CREDIT-2",

    "password_do_not_match": "Passwords do not match",
    "invalid_password_error": "Password must contain at least: 1 letter, 1 number and be at least 8 characters in length",
    "enter_valid_email": "Please enter a valid e-mail address.",
    "duplicate_username": "Username '{0}' already exists.",
    "emptyTextFieldErrorMsg": "Field is required.",

    "portal_success_color": "rgb(140, 197, 85)",
    "portal_base_color": "rgb(179, 179, 179)",
    "portal_primary_color": "rgb(57, 157, 221)",


    //These are urls used for checking the ML Service in Prod
    "mLServiceAU": "http://internal-alb-ecs-mlservices-1622752265.us-east-1.elb.amazonaws.com/health",
    "mLServiceCA": "http://internal-alb-ecs-mlservices-498479737.ca-central-1.elb.amazonaws.com/health",
    "mLServiceEU": "http://internal-alb-ecs-mlservices-964742544.eu-west-1.elb.amazonaws.com/health",
    "mLServiceUS": "http://internal-alb-ecs-mlservices-1813034510.ap-southeast-2.elb.amazonaws.com/health",
    "mLServiceUSsandbox": "http://internal-ALB-ECS-SANDBOX-MLSERVICES-1685813537.us-east-1.elb.amazonaws.com/health",
    //These are urls used for checking the ML Service in internal environments
    "mLServiceUAT1": "http://internal-alb-ecs-mlservices-uatprimary-1803384887.us-east-1.elb.amazonaws.com/health",
    "mLService5qa": "http://internal-alb-ecs-mlservices-5-qa-381394997.us-east-1.elb.amazonaws.com/health",
    "mLServiceSecondary": "http://internal-alb-ecs-mlservices-qasecondary-557557269.us-east-1.elb.amazonaws.com/health",
    "mLServiceQaMain": "http://internal-ALB-ECS-MlServices-QaMain-997871286.us-east-1.elb.amazonaws.com/health",
    
    //Layout name
    "layout_name_1": "GUIA-Layout" + new BasePage().getTimeStamp()

}
