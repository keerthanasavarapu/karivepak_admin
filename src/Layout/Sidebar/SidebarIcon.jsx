import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cubaimg from "../../assets/images/logo/faviconnew.svg"
import CustomizerContext from '../../_helper/Customizer';

const SidebarIcon = () => {
  const { layoutURL } = useContext(CustomizerContext);
  return (
    <div className="logo-icon-wrapper">
      <Link to={`${process.env.PUBLIC_URL}/pages/mainpages/dashboard/${layoutURL}`}>
        <img
          className="img-fluid"
          src={cubaimg}
          alt=""
          height={33}
          width={33}
        />
      </Link>
    </div>
  );
};

export default SidebarIcon;