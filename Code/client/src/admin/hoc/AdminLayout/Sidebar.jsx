/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import { Link } from "react-router-dom";
import PermissionRequired from "../../../common/hocs/PermissionRequired";

const styles = {
  percentStyle: {
    border: "1px solid white",
    padding: "2px 8px",
    fontSize: 10,
    marginRight: 5,
    marginLeft: "-3px",
    borderRadius: 5,
  },
  icon: {
    marginRight: 15,
    fontSize: 20,
    display: "inline-block",
  },
  label: {
    minWidth: 50,
    textAlign: "left",
    display: "inline-block",
    paddingLeft: 3,
    fontFamily: "Work Sans",
  },
};

const menuItems = [
  {
    label: "Dashboard",
    icon: "handel-home",
    link: "/admin/dashboard",
    permission: "dashboard",
  },
  {
    label: "Product Requests",
    icon: "handel-bin-request",
    link: "/admin/product-requests",
    permission: "listProductRequest",
  },
  {
    label: "Collection Requests",
    icon: "handel-collection-request",
    link: "/admin/collection-requests",
    permission: "listCollectionRequest",
  },
  {
    label: "Transactions",
    icon: "handel-history",
    link: "/admin/manage-transactions",
    permission: "listTransaction",
  },
  {
    label: "Discount Codes",
    icon: "handel-coupon",
    link: "/admin/manage-discounts",
    permission: "listDiscountCode",
  },
  {
    label: "Product Types",
    icon: "handel-product",
    link: "/admin/manage-product-types",
    permission: "listProductType",
  },
  {
    label: "Product Management",
    icon: "handel-product",
    link: "/admin/manage-products",
    permission: "listProduct",
  },
  {
    label: "Council",
    icon: "handel-pin-fulfill",
    link: "/admin/manage-councils",
    permission: "listCouncil",
  },
  {
    label: "Dumpsites",
    icon: "handel-dumpsite",
    link: "/admin/manage-dumpsites",
    permission: "listDumpsite",
  },
  {
    label: "Advertising",
    icon: "handel-advertising",
    link: "/admin/manage-advertising",
    permission: "listAdvertising",
  },
  {
    label: "Manage Accounts",
    icon: "handel-users",
    link: "/admin/manage-accounts",
    permission: "listAccount",
  },
  {
    label: "Disputes",
    icon: "handel-comment",
    link: "/admin/manage-disputes",
    permission: "listDispute",
  },
  {
    label: "Manage Eligible DB",
    icon: "handel-bin-request",
    link: "/admin/eligible-db",
    permission: "listManageDB",
  },
  {
    label: "Reports",
    icon: "handel-bin-request",
    link: "/admin/reports",
    permission: "listProductRequest",
  },
  /* these pages are not implemented yet */
  // {
  //   label: 'Analytics',
  //   icon: 'handel-analytics',
  //   link: '/admin/#analytics',
  //   permission: 'listAnalytics',
  // },
  // {
  //   label: 'Settings',
  //   icon: 'handel-comment',
  //   link: '/admin/#settings',
  //   permission: 'dashboard',
  // },
];

const SideBar = () => {

  return (
    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
      <div className="menu_section">
        <ul className="nav side-menu">
          {menuItems.map((item) => (
            <PermissionRequired permission={item.permission} key={item.link}>
              <li>
                <Link to={item.link}>
                  <span className={item.icon} style={styles.icon} />
                  <span className="menu-label" style={styles.label}>
                    {item.label}
                  </span>
                </Link>
              </li>
            </PermissionRequired>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;

export { menuItems };
