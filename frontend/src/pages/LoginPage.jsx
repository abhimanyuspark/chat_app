import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Form_UI } from "../components";
import { FiMessageSquare } from "../components/Icons";
import { Email, Password } from "../components/Inputs";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoggingIng, logIn } = useAuth();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await toast.promise(
      logIn(formData).then((res) => {
        if (res?.status === 200) {
          navigate("/", { replace: true });
        } else {
          throw new Error(res?.message || "Login failed");
        }
      }),
      {
        loading: "Logging...",
        success: "Login successfully",
        error: (err) => {
          return err?.message;
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col gap-4 w-80">
          <div className="flex items-center justify-center gap-2 flex-col">
            <div className="text-3xl p-2 bg-base-300 rounded">
              <FiMessageSquare />
            </div>
            <h2 className="text-lg font-bold">Login Account</h2>
            <p className="text-sm">Get started with your account</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Email onChange={onChange} value={formData.email} name={"email"} />
            <Password
              onChange={onChange}
              value={formData.password}
              show={show}
              name={"password"}
              onClick={() => setShow((prev) => !prev)}
            />
            <button className="btn btn-accent" disabled={isLoggingIng}>
              {isLoggingIng && (
                <span className="loading loading-spinner"></span>
              )}
              {isLoggingIng ? "Loading" : "Login Account"}
            </button>
          </form>

          <p className="text-sm text-center">
            Did't have an account?{" "}
            <Link className="font-bold hover:text-accent" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden items-center lg:flex flex-col gap-8 justify-center bg-base-300">
        <Form_UI />
        <div className="flex flex-col gap-4 items-center justify-center">
          <p className="font-bold">Join our community</p>
          <p className="text-sm w-100 text-center">
            connect with friends, and share moments, and stay in touch with your
            loved ones
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
