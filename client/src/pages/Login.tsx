import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/authProvider";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { LiaEyeSolid } from "react-icons/lia";
import { LiaEyeSlashSolid } from "react-icons/lia";
import ValidSVG from "../assets/img/valid_1.svg";
import InvalidSVG from "../assets/img/cross_2.svg";
import axios from "axios";

const ENDPOINT_URL = `/user/login`;
const EMAIL_REGEXP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;

function Login() {
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEXP.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEXP.test(password));
  }, [password]);

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("email : ", email, "password : ", password);
    e.preventDefault();
    setIsLoading(true);
    try {
      //remplacer par axiosInstance
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${ENDPOINT_URL}`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("response : ", response.data);
      const { accessToken } = response.data;

      if (accessToken) {
        login(accessToken);
        setEmail("");
        setPassword("");
        setIsLoading(false);
        console.log("Succes login");
        setSuccess(true);
      }
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("No Server Response. Please try again later.");
      } else if (error.response.status === 401) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 401) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
      setIsLoading(false);

      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  };

  const [visible, setVisible] = useState(false);
  const togglePasswordVisibility = () => {
    const iconEye = visible ? (
      <LiaEyeSlashSolid
        onClick={() => setVisible(!visible)}
        className="input-icon-password"
      />
    ) : (
      <LiaEyeSolid
        onClick={() => setVisible(!visible)}
        className="input-icon-password"
      />
    );

    const inputType = visible ? "text" : "password";

    return [inputType, iconEye];
  };
  const [passwordType, iconEye] = togglePasswordVisibility();

  return (
    <div>
      {success ? (
        <section className="flex flex-col items-center justify-center min-h-screen">
          <h1>C'est good !</h1>
          <p>Tu es co mon frere !</p>
          <Link to="/profile">Mon profil</Link>
        </section>
      ) : (
        <div className="flex justify-center items-center min-h-screen test2 bg-cover bg-center bg-no-repeat">
          <section className="bg-color-primary-100 w-11/12 my-6 p-8 sm:w-10/12 sm:p-12 md:w-9/12 lg:w-11/12 xl:w-10/12 2xl:w-7/12 rounded-sm">
            <h2 className="font-abc-h text-x26 md:text-x28 text-center lg:text-left mb-8 color-primary-900">
              Sign In
            </h2>
            {errorMessage && (
              <div className="mb-6">
                <p
                  ref={errorRef}
                  tabIndex={-1}
                  className="font-abc-b text-x16 text-red-400"
                  aria-live="assertive"
                >
                  {errorMessage}
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="pb-8 md:pb-10">
                <div className={email && "row-container"}>
                  <div className="input-container">
                    <input
                      type="text"
                      id="email"
                      ref={emailRef}
                      tabIndex={-1}
                      className={
                        validEmail || !email
                          ? "input-primary input-primary-bg px-8 pt-2 w-full text-x16 lg:text-x18"
                          : "input-primary input-primary-bg-invalid px-8 pt-2 w-full text-x16 lg:text-x18"
                      }
                      required
                      aria-invalid={validEmail ? "false" : "true"}
                      aria-describedby="email-note"
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                    <label
                      htmlFor="email"
                      className="label-primary px-2 mx-6 text-x15 md:text-x16 lg:text-x17"
                    >
                      Email *
                    </label>
                  </div>
                  <div className="input-icon-container">
                    <img
                      className={validEmail ? "h-12 w-12" : "hidden"}
                      src={ValidSVG}
                      alt="valid"
                    />
                    <img
                      className={validEmail || !email ? "hidden" : "h-12 w-12"}
                      src={InvalidSVG}
                      alt="cross"
                    />
                  </div>
                </div>
                {emailFocus && email && !validEmail && (
                  <div className="mt-4 flex items-center gap-1">
                    <p id="email-note" className="input-info-text">
                      Please enter a valid email address.
                    </p>
                  </div>
                )}
              </div>
              <div className="pb-8 md:pb-10">
                <div className={password && "row-container"}>
                  <div className="input-container">
                    <input
                      type={passwordType}
                      id="password"
                      className={
                        validPassword || !password
                          ? "input-primary input-primary-bg px-8 pt-2 w-full text-x16 lg:text-x18"
                          : "input-primary input-primary-bg-invalid px-8 pt-2 w-full text-x16 lg:text-x18"
                      }
                      required
                      aria-invalid={validPassword ? "false" : "true"}
                      aria-describedby="password-note"
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                    />
                    <label
                      htmlFor="password"
                      className="label-primary px-2 mx-6 text-x15 md:text-x16 lg:text-x17"
                    >
                      Password *
                    </label>
                    {password && (
                      <div className="input-icon-container px-2 mx-6">
                        <span>{iconEye}</span>
                      </div>
                    )}
                  </div>
                  <div className="input-icon-container">
                    <img
                      className={validPassword ? "h-12 w-12" : "hidden"}
                      src={ValidSVG}
                      alt="valid"
                    />
                    <img
                      className={
                        validPassword || !password ? "hidden" : "h-12 w-12"
                      }
                      src={InvalidSVG}
                      alt="cross"
                    />
                  </div>
                </div>
                {passwordFocus && !validPassword && (
                  <div className="mt-4 flex items-center gap-1">
                    <p id="password-note" className="input-info-text">
                      Password must be 8-24 characters and include uppercase,
                      lowercase, a number and a special character.
                    </p>
                  </div>
                )}
              </div>
              <div id="submit-button">
                {isLoading ? (
                  <div className="flex justify-center">
                    <PulseLoader color="#eb474a" margin={4} size={10} />
                  </div>
                ) : (
                  <button
                    className={
                      !validEmail || !validPassword
                        ? "bg-color-primary-300 color-primary-100 font-abc-m font-22 py-3 w-full cursor-not-allowed"
                        : "button-primary font-abc-m font-22 py-3 w-full"
                    }
                    disabled={!validEmail || !validPassword ? true : false}
                  >
                    Sign Up
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Login;
