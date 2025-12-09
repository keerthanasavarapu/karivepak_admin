import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogIn, Mail, User } from "react-feather";
import man from "../../../assets/images/userForDash.png";
import cuba from '../../../assets/images/logo/faviconnew.svg'
import { LI, UL, Image, P } from "../../../AbstractElements";
import CustomizerContext from "../../../_helper/Customizer";
import { Account, Admin, Color, Inbox, LogOut, Taskboard } from "../../../Constant";

const UserHeader = () => {
  const history = useNavigate();
  const [profile, setProfile] = useState("");
  const [name, setName] = useState();
  const { layoutURL } = useContext(CustomizerContext);
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("UserData"));
  const userRole = JSON.parse(localStorage.getItem("role_name"));

  useEffect(() => {
    UserData()
  }, [])

  const UserData = async () => {
    const user = await JSON.parse(localStorage.getItem('UserData'))
    const usert = await JSON.parse(localStorage.getItem('token'))
    // setName(user.first_name ?   user.first_name :  user?.storeName);
    setName(user.name)
  }

  const Logout = () => {
   localStorage.clear();
     history("/login", { replace: true }); 
  };

  const UserMenuRedirect = (redirect) => {
    history(redirect);
  };

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        <div className="border-1 border-[#007F2D] w-9 h-9 rounded-full flex justify-center items-center">
          <Image
            attrImage={{
              className: "w-5 h-5 ",
              src: `${man}`,
              alt: "",
              style: { width: '22px', marginLeft: '13px',
                filter: 'hue-rotate(286deg)', // Adjust the hue
              }


            }}
          />
        </div>
        <div className="media-body">
          <span>{name}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {userRole ? userRole : Admin} <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: "profile-dropdown onhover-show-div py-4" }}>
        {/* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/users/profile/${layoutURL}`),
          }}>
       
          <span className=" flex flex-row font-medium">  <User />{Account} </span>
        </LI> */}

        {/* <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/todo-app/todo/${layoutURL}`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI> */}

        <LI attrLI={{ onClick: Logout }}>
          {/* <LogIn /> */}
          <span className="flex flex-row font-medium"> <LogIn />{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
