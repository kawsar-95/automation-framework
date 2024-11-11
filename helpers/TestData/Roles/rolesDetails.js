import arBasePage from '../../AR/ARBasePage'

export const rolesDetails = {
    "roleName" : 'GUIA-CED-Role-' + new arBasePage().getTimeStamp(),
    "roleDescription" :"GUIA-CED-Description-"+ new arBasePage().getTimeStamp(),
    "Admin": "Admin"
}

export const defaultRoleNames ={
    "ADMIN":"Admin",
    "BILLING":"Billing",
    "CREATE_EDITOR":"Create Editor",
    "INSTRUCTOR":"Instructor",
    "INTERNAL_SALES_ADMIN":"Internal Sales Admin",
    "MULTIPLE_CLIENT_ADMIN":"Multiple Client Admin",
    "REPORTER":"Reporter",
    "SYSTEM_ADMIN":"System Admin"
}