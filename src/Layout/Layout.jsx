import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Taptop from "./TapTop";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ThemeCustomize from "../Layout/ThemeCustomizer";
import Footer from "./Footer";
import CustomizerContext from "../_helper/Customizer";
import AnimationThemeContext from "../_helper/AnimationTheme";
import ConfigDB from "../Config/ThemeConfig";
import Loader from "./Loader";
import { MENUITEMS } from "./Sidebar/Menu";
import FirebaseComponent from "../Components/FirebaseComponent";

const AppLayout = ({ children, classNames, ...rest }) => {
  const { layout } = useContext(CustomizerContext);
  const { sidebarIconType } = useContext(CustomizerContext);
  const userRole = JSON.parse(localStorage.getItem('role_name'))

  const layout1 = localStorage.getItem("sidebar_layout") || layout;
  const sideBarIcon = localStorage.getItem("sidebar_icon_type") || sidebarIconType;
  const location = useLocation();
  const { animation } = useContext(AnimationThemeContext);
  const animationTheme = localStorage.getItem("animation") || animation || ConfigDB.data.router_animation;

  const filterMenuItemsByRole = (menuItems, userRoles) => {
    return menuItems.map(menu => {
      // Filter out menu items based on user's roles
      const filteredItems = menu.Items.filter(item => {
        if (!item.roles || item.roles.some(role => userRoles.includes(role))) {
          return true; // Include the item if it has no roles or if user has any of the required roles
        }
        return false;
      });
      // Update the menu with filtered items
      return { ...menu, Items: filteredItems };
    });
  };


  const filteredMenuItems = filterMenuItemsByRole(MENUITEMS, userRole);

  return (
    <Fragment>
    <FirebaseComponent/>
      <Loader />
      <Taptop />
      <div className={`page-wrapper ${layout1}`} sidebar-layout={sideBarIcon} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar menuItems={filteredMenuItems} />
          <TransitionGroup {...rest}>
            <CSSTransition key={location.key} timeout={100} classNames={animationTheme} unmountOnExit>
              <div className="page-body">
                <div>
                  <div>
                    <Outlet />
                  </div>
                </div>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </div>
      </div>
      <ThemeCustomize />
      <ToastContainer />
    </Fragment>
  );
};
export default AppLayout;
