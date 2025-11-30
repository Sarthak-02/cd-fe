import {paths} from '../utils/constants/paths'

function getAllPages(){
  let allPages =  paths.map(({permission,label}) => ({"value":permission,label}))

  allPages = allPages.filter(({value}) => value !== "user_management");
  return allPages
}

export const userSchema = [
    {
      "section_title": "User Account Information",
      "fields": [
        {
          "id": "username",
          "name": "Username",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "userid",
          "name": "User ID",
          "value": "",
          "type": "text",
          "disabled":false,
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "password",
          "name": "Password",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "isadmin",
          "name": "Is Admin",
          "value": false,
          "type": "checkbox",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Permissions",
      "fields": [
        {
          "id": "site_permissions",
          "name": "Site Permissions",
          "value": [],
          "type": "dropdown",
          "options": [{value:"kv",label:"Kendriya Vidyalaya"},{value:"dav",label:"DAV"}],
          "mandatory": true,
          "multiple":true,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        },
        {
          "id": "page_permissions",
          "name": "Page Permissions",
          "value": [],
          "type": "dropdown",
          "options": getAllPages(),
          "mandatory": true,
          "multiple":true,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        }
      ]
    }
  ]
  