export const MENUITEMS = [
  {
    menutitle: 'Main Menus',
    menucontent: 'Dashboards,Widgets',
    Items: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        type: 'link',
        active: true,
        path: `/dashboard`
      },
      // {
      //   title: 'Industries',
      //   icon: 'order',
      //   type: 'link',
      //   active: false,
      //   path: `/industries`
      // },
       {
        title: 'Products',
        icon: 'product',
        active: false,
        type: "sub",
        path: ``,
        badge: "badge badge-light-danger",
        children: [
          { path: `/category`, title: "Category", type: "link" },
          { path: `/sub-category`, title: "Sub-Category", type: "link" },
          { path: `/products`, title: "Products", type: "link" },
          // { path: `/variants`, title: "Variants", type: "link" },
        ],
        
      },

       {
        title: 'Orders',
        icon: 'order',
        active: false,
        type: "sub",
        path: ``,
        badge: "badge badge-light-danger",
        children: [
          { path: `/orders`, title: "Orders", type: "link" },
         
        ],
        // roles: ['Admin','Renter']
      },
      // {
      //   title: 'vendors',
      //   icon: 'product',
      //   // type: 'link',
      //   active: false,
      //   // path: `/products`
      //   type: "sub",
      //   path: ``,
      //   badge: "badge badge-light-danger",
      //   // badgetxt: "6",
      //   // roles: ['admin'] ,
      //   children: [
      //     { path: `/products`, title: "Products", type: "link" },
      //     { path: `/brands`, title: "Brands", type: "link" },
      //     { path: `/collections`, title: "Collections", type: "link" },
      //     { path: `/sub-collections`, title: "Sub-Collections", type: "link" },
      //     { path: `/variants`, title: "Variants", type: "link" },

      //     // { path: `/items`, title: "Items", type: "link" },
      //     // {
      //     //   path: `/products`, title: "Products", type: "link"
      //     // },
      //     // { path: `/stocks`, title: "Stocks", type: "link" },
      //   ],
      //   roles: ['admin']
      // },
      // {
      //   title: 'Consultants',
      //   icon: 'product',
      //   // type: 'link',
      //   active: false,
      //   // path: `/products`
      //   type: "sub",
      //   path: ``,
      //   badge: "badge badge-light-danger",
      //   // badgetxt: "6",
      //   // roles: ['admin'] ,
      //   children: [
      //     { path: `/products`, title: "Products", type: "link" },
      //     { path: `/brands`, title: "Brands", type: "link" },
      //     { path: `/collections`, title: "Collections", type: "link" },
      //     { path: `/sub-collections`, title: "Sub-Collections", type: "link" },
      //     { path: `/variants`, title: "Variants", type: "link" },

      //     { path: `/items`, title: "Items", type: "link" },
      //     {
      //       path: `/products`, title: "Products", type: "link"
      //     },
      //     { path: `/stocks`, title: "Stocks", type: "link" },
      //   ],
      //   // roles: ['store']
      // },
      // {
      //   title: 'Variants',
      //   icon: 'variant',
      //   type: 'link',
      //   active: false,
      //   path: `/variants`
      // },
      // {
      //   title: 'Brands',
      //   icon: 'brand',
      //   type: 'link',
      //   active: false,
      //   path: `/brands`
      // },
      // {
      //   title: 'Products',
      //   icon: 'transaction',
      //   type: 'link',
      //   active: false,
      //   path: `/products`
      // },
      {
        // title: "Services",
        // icon: "store",
        // type: "link",
        // path: `/services`,
        // badge: "badge badge-light-danger",
        // badgetxt: "6",
        active: false,
        // roles: ['admin'],
        // children: [
        //   { path: `/store`, title: "Stores", type: "link" },
        //   { path: `/collections`, title: "Collections", type: "link" },
        //   { path: `/subcollections`, title: "Sub Collections", type: "link" },
        // ],
      },
      // {
      //   title: "Promotions",
      //   icon: "store",
      //   type: "link",
      //   path: `/Promotions`,
      //   badge: "badge badge-light-danger",
      //   active: false,
        
      //   // roles: ['store'],
      // },
        {
        title: 'Users',
        icon: 'customer',
        active: false,
        type: "sub",
        path: ``,
        badge: "badge badge-light-danger",
        children: [
          { path: `/users`, title: "Users", type: "link" },
          { path: `/delivery-person`, title: "Delivery-Person", type: "link" },
          // { path: `/business-info`, title: "Business Info", type: "link" },
        ],
        // roles: ['Admin']
      },
      // {
      //   title: "Posts",
      //   icon: "store",
      //   type: "link",
      //   path: `/posts`,
      //   badge: "badge badge-light-danger",
      //   active: false,
      //   roles: ['admin'],
      // },
      {
        title: "Transaction",
        icon: "report",
        type: "link",
        path: `transactions`,
        badge: "badge badge-light-danger",
        active: false,
        // roles: ['admin'] ,
      },
      // {
      //   title: 'Statistics',
      //   icon: 'statistic',
      //   type: 'link',
      //   active: false,
      //   path: `/statistics`
      // },
      // {
      //   title: 'Invoices',
      //   icon: 'customer',
      //   type: 'link',
      //   active: false,
      //   path: `/invoice`,
      //   // roles: ['admin'],
      // },
      // {
      //   title: 'Role Management',
      //   icon: 'role',
      //   type: 'link',
      //   active: false,
      //   path: `/role-management`,
      //   roles: ['admin']
      // },
      // {
      //   title: 'Role Management',
      //   icon: 'role',
      //   type: 'link',
      //   active: false,
      //   path: `/role-management`,
      //   roles: ['store']
      // },
      {
        title: 'CMS',
        icon: 'role',
        type: 'link',
        active: false,
        path: `/content-management`,
        roles: ['admin']
      },
      // {
      //   title: 'Log Activity',
      //   icon: 'log',
      //   type: 'link',
      //   active: false,
      //   path: `/activity`
      // },
    ],
  },
  // {
  //   menutitle: 'Support',
  //   menucontent: 'Dashboards,Widgets',
  //   Items: [
  //     {
  //       title: 'Settings',
  //       icon: 'setting',
  //       type: 'link',
  //       active: true,
  //       path: `/setting`
  //     },
  //     // {
  //     //   title: 'Help',
  //     //   icon: 'help',
  //     //   type: 'link',
  //     //   active: false,
  //     //   path: `/help`
  //     // },
  //   ],
  // },
];
