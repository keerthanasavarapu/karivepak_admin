import React, { Fragment, useState, useEffect, useContext } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Media, Row } from "reactstrap";
import { Btn, H4, Image, P } from "../AbstractElements";
import { EmailAddress, ForgotPassword, FullName, Password, RememberPassword, SignIn } from "../Constant";

import { useNavigate, useRevalidator } from "react-router-dom";
import man from "../assets/images/dashboard/profile.png";

import CustomizerContext from "../_helper/Customizer";
import OtherWay from "./OtherWay";
import { ToastContainer, toast } from "react-toastify";
import CubaIcon from '../assets/images/logo/Logo.svg';


import axios from 'axios'
import { baseURL } from "../Services/api/baseURL";
import { AuthContext, AuthProvider, useAuthContext } from "../context/Auth";

const Signin = ({ selected }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  const { layoutURL } = useContext(CustomizerContext);
  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));
  const [name, setName] = useState();
  const [loginType, setLoginType] = useState('Admin');

  useEffect(() => {
    localStorage.setItem("profileURL", man);
    localStorage.setItem("Name", name);
  }, [value, name]);

  const loginAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const obj = { email: email, password: password };
      const postuser = await axios.post(`${baseURL}/api/auth/login`, obj, { timeout: 90000 });
      toast.success("Successfully logged in!..");
      const token = postuser.data.token;
      const full_Name = postuser.data?.user?.name;
      setName(full_Name);
      localStorage.setItem("UserData", JSON.stringify(postuser.data.user));
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("login", JSON.stringify(true));
      localStorage.setItem("authenticated", JSON.stringify(true));
      localStorage.setItem("role_name", JSON.stringify(postuser?.data?.user?.role));
      history(`/dashboard`);
    } catch (error) {
      console.log(error);
      const status = error?.response?.status;
      if (!error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        toast.error("Server is starting up, please wait a moment and try again.", { autoClose: 6000 });
      } else if (status === 401) {
        toast.error("Invalid email or password. Please check your credentials.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
    // if (email === "test@gmail.com" && password === "test123") {
    //   localStorage.setItem("login", JSON.stringify(true));

    // }
    // history(`${process.env.PUBLIC_URL}/pages/mainpages/Dashboard/index/:layout`);
    // toast.success("Successfully logged in!..");
    // } else {
    //   toast.error("You enter wrong password or username!..");
    // }
  };


  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form">

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <Image attrImage={{ className: 'img-fluid d-inline w-50', src: `${CubaIcon}`, alt: '' }} />
                  </div>
                  {/* <div className="switches-container">
                    <input
                      type="radio"
                      id="switchAdmin"
                      name="switchPlan"
                      value="Admin"
                      checked={loginType === 'Admin'}
                      onChange={() => setLoginType('Admin')}
                    />
                    <input
                      type="radio"
                      id="switchPartner"
                      name="switchPlan"
                      value="Partner"
                      checked={loginType === 'Partner'}
                      onChange={() => setLoginType('Partner')}
                    />
                    <label htmlFor="switchAdmin">Login as Admin</label>
                    <label htmlFor="switchPartner">Login as Store</label>
                    <div className="switch-wrapper">
                      <div className="switch">
                        <div>Login as Admin</div>
                        <div>Login as Store</div>
                      </div>
                    </div>
                  </div> */}
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input className="form-control" placeholder="text@gmail.com" type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                  </FormGroup>
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">{Password}</Label>
                    <div className="position-relative">
                      <Input className="form-control" placeholder="************" type={togglePassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} />
                      <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                  </FormGroup>
                  <div className="position-relative form-group mb-0">
                    <div className="checkbox">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" for="checkbox1">
                        {RememberPassword}
                      </Label>
                    </div>
                    {/* <a className="link" href="#javascript">
                      {ForgotPassword}
                    </a> */}
                    <button
                      className="d-block w-100 mt-2 py-2.5 rounded-xl text-white bg-[#007F2D]"
                      onClick={(e) => loginAuth(e)}
                      disabled={isLoading}
                      style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                      {isLoading ? "Signing in..." : SignIn}
                    </button>
                    {isLoading && (
                      <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '8px' }}>
                        Server is waking up, this may take up to 30 seconds...
                      </p>
                    )}
                  </div>
                  {/* <div className="flex justify-center items-center mt-2">
                    <p>Don't have account?<span className="text-[#d3178a]">Create Account</span></p>
                  </div> */}
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container >
      <ToastContainer />
    </Fragment >
  );
};

export default Signin;


