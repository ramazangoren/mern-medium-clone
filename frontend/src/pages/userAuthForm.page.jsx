import AnimationWrapper from "../common/page-animation";
import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {
  // const authForm = useRef(null);

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  // console.log(access_token);

  const userAuthThoughServer = (serverRoute, formData) => {
    axios
      // .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .post(serverRoute, formData)
      .then(({ data }) => {
        // console.log(data);
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    // form data
    // let form = new FormData(authForm.current);
    let form = new FormData(formElement);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    // form validation
    const { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("fullname must be at least 3 letters long");
      }
    }

    if (!email.length) {
      return toast.error("enter Email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 uppercase, 1 lowercase letters"
      );
    }

    userAuthThoughServer(serverRoute, formData);
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "welcome back" : "join us "}
          </h1>
          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />
          <button
            type="submit"
            className="btn-dark center mt-14"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} alt="logo google" className="w-5" />
            continue with google
          </button>
          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-center text-xl">
              Don't have an account?
              <Link
                to={`/signup`}
                className="underline text-black text-xl ml-1"
              >
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-center text-xl">
              Already a member?
              <Link
                to={`/signin`}
                className="underline text-black text-xl ml-1"
              >
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
