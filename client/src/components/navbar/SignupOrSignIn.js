//react
import { useState, useEffect } from "react";
//redux
import { connect } from "react-redux";
import { signUp, signIn, toggleIsIsSignup } from "../../actions/auth";
//components
import Input from "../common/Input";
import Button from "../common/Button";
//icons
import {
  AiOutlineClose,
  AiOutlineUserAdd,
  AiOutlineLogin,
} from "react-icons/ai";

const SignUpOrSignIn = ({
  onClose,
  hide,
  signUp,
  signIn,
  auth,
  ongoingOnServer,
  toggleIsIsSignup,
}) => {
  const { isSignup } = auth;
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (auth?.user) {
      hide();
    }
  }, [auth?.user, hide]);

  const handleInputChange = (event) => {
    const target = event.target;
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const handleSubmit = (event) => {
    const { username, password } = formValues;
    event.preventDefault();

    if (password && username) {
      if (isSignup) {
        signUp({ username, password });
      } else {
        signIn({ username, password });
      }
    }
  };
  const inputLabelPair = ({ name, type, label, placeholder, required }) => {
    if (!name) {
      return null;
    }
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <label htmlFor={name} className="text-blue-500">
            {label}
          </label>
        </div>

        <Input
          required={required}
          inputType={type ? type : "text"}
          onChange={handleInputChange}
          value={formValues[name]}
          name={name}
          className="w-full h-12 px-2 rounded-md  placeholder-gray-400  bg-white text-lg focus-yellow hover:bg-gray-50"
          placeholder={placeholder}
        />
      </div>
    );
  };

  const welcomeMessage = () => {
    return (
      <div className="flex flex-col space-y-2 justify-center mb-6 px-4 pt-6 pb-3 bg-blue-200 bg-opacity-60 text-gray-700  rounded-t-xl">
        <h2 className="text-3xl">Welcome</h2>

        <p>
          {isSignup ? "Already a member ?" : "Don't have an account ?"}{" "}
          <Button
            type="text"
            onClick={toggleIsIsSignup}
            className="inline-flex"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </Button>
        </p>
      </div>
    );
  };

  const SubmitButton = () => {
    return (
      <Button
        className="rounded-b-xl w-full h-12 bg-blue-500 text-white"
        type="none"
        loading={ongoingOnServer["authenticating"]}
      >
        {ongoingOnServer["authenticating"] ? null : isSignup ? (
          <AiOutlineUserAdd />
        ) : (
          <AiOutlineLogin />
        )}
        <span>{isSignup ? "Sign Up" : "Sign In"}</span>
      </Button>
    );
  };

  const CloseButton = () => {
    return (
      <Button
        type="none"
        className="absolute top-2 right-2 text-2xl rounded-full font-bold text-blue-500 p-2 hover:bg-blue-300"
        onClick={() => {
          if (onClose) {
            onClose();
          }
          hide();
        }}
      >
        <AiOutlineClose />
      </Button>
    );
  };

  return (
    <div className="bg-blue-100 w-full max-w-lg relative rounded-xl">
      {CloseButton()}
      {welcomeMessage()}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-10">
          <div className="flex flex-col space-y-6 px-4">
            {inputLabelPair({
              name: "username",
              placeholder: "username",
              label: "Username",
              required: true,
            })}
            {inputLabelPair({
              name: "password",
              placeholder: "password",
              type: "password",
              label: "Password",
              required: true,
            })}
          </div>

          {auth?.errMsg?.for === "authenticating" && (
            <p className="text-red-500 text-sm font-semibold min-h-18 px-4">
              {auth.errMsg.msg}
            </p>
          )}

          {SubmitButton()}
        </div>
      </form>
    </div>
  );
};
const connectStateToProps = (state) => {
  return { auth: state.auth, ongoingOnServer: state.ongoingOnServer };
};
export default connect(connectStateToProps, {
  signUp,
  signIn,
  toggleIsIsSignup,
})(SignUpOrSignIn);
