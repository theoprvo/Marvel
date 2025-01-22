import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ValidSVG from "../assets/img/valid_1.svg";
import InvalidSVG from "../assets/img/cross_2.svg";
import { LiaEyeSolid } from "react-icons/lia";
import { LiaEyeSlashSolid } from "react-icons/lia";

// TODO: Responsive + Google & Facebook OAuth + Error/Valid field icon restyle ?

const USER_REGEXP = /^[a-zA-Z][a-zA-Z0-9-_]{3,15}$/;
const EMAIL_REGEXP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;

function Signup() {
  const usernameRef = useRef();
  const errorRef = useRef();

  const [username, setUsername] = useState<string>("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // ??
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(USER_REGEXP.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEXP.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEXP.test(password));
    const isValid = password === confirmPassword;
    setValidConfirmPassword(isValid);
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrorMessage("");
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username, "Email:", email, "Password:", password);
    setSuccess(true);
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
        <section>
          <h1>C'est good !</h1>
          <p>Le compte est créer mon frere !</p>
          <Link to="/">Home</Link>
        </section>
      ) : (
        <div className="min-h-screen flex row-auto test2 bg-cover bg-center bg-no-repeat">
          <div className="w-full flex justify-center items-end pb-96 pl-20">
            <h1 className="font-alte-b h1-alte font-90 uppercase color-primary-100">
              Create Your Account
            </h1>
          </div>
          <div className="w-full flex justify-center items-center">
            <section className="bg-color-primary-100 w-8/12 px-24 py-28 rounded-sm">
              <p
                ref={errorRef}
                className={errorMessage ? "display" : "hidden"}
                aria-live="assertive"
              >
                {errorMessage}
              </p>
              <h2 className="pb-12 font-32 font-abc-h color-primary-900">
                Sign Up
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="pb-8">
                  <div className={username && "row-container"}>
                    <div className="input-container">
                      <input
                        type="text"
                        id="username"
                        className={
                          validUsername || !username
                            ? "input-primary input-primary-bg px-8 pt-2 w-full"
                            : "input-primary input-primary-bg-invalid px-8 pt-2 w-full"
                        }
                        ref={usernameRef}
                        autoComplete="off"
                        required
                        aria-invalid={validUsername ? "false" : "true"}
                        aria-describedby="username-note"
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                      />
                      <label
                        className="label-primary px-2 mx-6"
                        htmlFor="username"
                      >
                        Username *
                      </label>
                    </div>
                    <div className="input-icon-container">
                      <img
                        className={validUsername ? "h-12 w-12" : "hidden"}
                        src={ValidSVG}
                        alt="valid"
                      />
                      <img
                        className={
                          validUsername || !username ? "hidden" : "h-12 w-12"
                        }
                        src={InvalidSVG}
                        alt="cross"
                      />
                    </div>
                  </div>
                  {usernameFocus && username && !validUsername && (
                    <div className="mt-4 flex items-center gap-1">
                      <p id="username-note" className="input-info-text">
                        Username must be 4-16 characters long.
                      </p>
                    </div>
                  )}
                </div>
                <div className="pb-8">
                  <div className={email && "row-container"}>
                    <div className="input-container">
                      <input
                        type="text"
                        id="email"
                        className={
                          validEmail || !email
                            ? "input-primary input-primary-bg px-8 pt-2 w-full"
                            : "input-primary input-primary-bg-invalid px-8 pt-2 w-full"
                        }
                        autoComplete="off"
                        required
                        aria-invalid={validEmail ? "false" : "true"}
                        aria-describedby="email-note"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                      <label
                        htmlFor="email"
                        className="label-primary px-2 mx-6"
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
                        className={
                          validEmail || !email ? "hidden" : "h-12 w-12"
                        }
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
                <div className="pb-8">
                  <div className={password && "row-container"}>
                    <div className="input-container">
                      <input
                        type={passwordType}
                        id="password"
                        className={
                          validPassword || !password
                            ? "input-primary input-primary-bg px-8 pt-2 w-full"
                            : "input-primary input-primary-bg-invalid px-8 pt-2 w-full"
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
                        className="label-primary px-2 mx-6"
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
                <div className="pb-8">
                  <div className={confirmPassword && "row-container"}>
                    <div className="input-container">
                      <input
                        type={passwordType}
                        id="confirm-password"
                        className={
                          validConfirmPassword || !confirmPassword
                            ? "input-primary input-primary-bg px-8 pt-2 w-full"
                            : "input-primary input-primary-bg-invalid px-8 pt-2 w-full"
                        }
                        required
                        aria-invalid={validConfirmPassword ? "false" : "true"}
                        aria-describedby="confirm-password-note"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setConfirmPasswordFocus(true)}
                        onBlur={() => setConfirmPasswordFocus(false)}
                      />
                      <label
                        htmlFor="confirm-password"
                        className="label-primary px-2 mx-6"
                      >
                        Confirm Password *
                      </label>
                      {confirmPassword && (
                        <div className="input-icon-container px-2 mx-6">
                          <span>{iconEye}</span>
                        </div>
                      )}
                    </div>
                    <div className="input-icon-container">
                      <img
                        className={
                          validConfirmPassword && confirmPassword
                            ? "h-12 w-12"
                            : "hidden"
                        }
                        src={ValidSVG}
                        alt="valid"
                      />
                      <img
                        className={
                          validConfirmPassword || !confirmPassword
                            ? "hidden"
                            : "h-12 w-12"
                        }
                        src={InvalidSVG}
                        alt="cross"
                      />
                    </div>
                  </div>
                  {confirmPasswordFocus && !confirmPassword && (
                    <div className="mt-4 flex items-center gap-1">
                      <p id="confirm-password-note" className="input-info-text">
                        Must match the first password.
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    className={
                      !validUsername ||
                      !validEmail ||
                      !validPassword ||
                      !validConfirmPassword
                        ? "bg-color-primary-300 color-primary-100 font-abc-m font-22 py-3 w-full cursor-not-allowed"
                        : "button-primary font-abc-m font-22 py-3 w-full"
                    }
                    disabled={
                      !validUsername ||
                      !validEmail ||
                      !validPassword ||
                      !validConfirmPassword
                        ? true
                        : false
                    }
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <div className="oauth-section">
                {/* TODO: Register with google */}
                <div className="flex flex-row items-center justify-center my-16">
                  <div className="h-px bg-color-primary-300 w-5/12"></div>
                  <p className="w-2/12 text-center color-primary-500">OR</p>
                  <div className="h-px bg-color-primary-300 w-5/12"></div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                <button className="button-primary font-abc-m font-22 py-3 w-1/2">
                  Sign up with Google
                </button>
                <button className="button-primary font-abc-m font-22 py-3 w-1/2">
                  Sign up with Facebook
                </button>
              </div>

              <div className="flex justify-center mt-8">
                <p className="font-abc-l font-14 color-primary-700">
                  Already have an account ?
                  <Link to="/login">
                    <span className="color-secondary-500 pl-2 hover:underline">
                      Sign in
                    </span>
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
