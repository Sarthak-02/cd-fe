import { paths } from "../utils/constants/paths";

function getAllPages() {
  let allPages = paths.map(({ permission, label }) => ({
    value: permission,
    // NOTE: label here should ideally already be an i18n key
    label
  }));

  allPages = allPages.filter(({ value }) => value !== "user_management");
  return allPages;
}

export const userSchema = [
  {
    section_title: "user.sections.accountInformation",
    fields: [
      {
        id: "username",
        name: "user.fields.username",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "userid",
        name: "user.fields.userId",
        value: "",
        type: "text",
        disabled: false,
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "password",
        name: "user.fields.password",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "isadmin",
        name: "user.fields.isAdmin",
        value: false,
        type: "checkbox",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "user.sections.permissions",
    fields: [
      {
        id: "site_permissions",
        name: "user.fields.sitePermissions",
        value: [],
        type: "dropdown",
        options: [
          { value: "kv", label_key: "user.site.kv" },
          { value: "dav", label_key: "user.site.dav" }
        ],
        mandatory: true,
        multiple: true,
        width: { tablet: 6, desktop: 6, mobile: 12 }
      },
      {
        id: "page_permissions",
        name: "user.fields.pagePermissions",
        value: [],
        type: "dropdown",
        options: getAllPages(),
        mandatory: true,
        multiple: true,
        width: { tablet: 6, desktop: 6, mobile: 12 }
      }
    ]
  }
];
