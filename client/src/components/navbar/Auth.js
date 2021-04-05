//react
import React from "react";
//custom hooks
import { useModal } from "../common/Modal/useModal";

//redux
import { connect } from "react-redux";
import { signOut } from "../../actions/auth";
//components
import SignupOrSignIn from "./SignupOrSignIn";
import DropDown from "../common/DropDown";
import Button from "../common/Button";
//icons
import {
  AiOutlineLogin,
  AiOutlineFolderOpen,
  AiOutlineLogout,
  AiFillStar,
  AiOutlineEdit,
} from "react-icons/ai";
import { FaUser } from "react-icons/fa";
//router
import history from "../../history";
import {
  FAVORITES_PATH,
  MANAGE_ACCOUNT_PATH,
  USER_PATH,
} from "../../routes/paths";
const Auth = ({ auth, signOut }) => {
  const { user } = auth;
  const [RenderAuthModal, showAuthModal, hideAuthModal] = useModal();
  const UserAvatar = () => {
    return (
      <DropDown
        options={[
          {
            text: user?.username,
            func: null,

            isTitle: true,
          },

          {
            text: "My sheets",
            icon: <AiOutlineFolderOpen />,
            func: () => {
              history.push(`${USER_PATH}/${auth?.user?._id}`);
            },
          },
          {
            text: "My favorites",
            icon: <AiFillStar />,
            func: () => {
              history.push(FAVORITES_PATH);
            },
          },
          {
            text: "Manage account",
            icon: <AiOutlineEdit />,
            func: () => {
              history.push(MANAGE_ACCOUNT_PATH);
            },
          },
          { text: "Sign Out", func: signOut, icon: <AiOutlineLogout /> },
        ]}
      >
        <Button
          className="bg-blue-200 text-blue-500 rounded-full p-3"
          type="none"
        >
          <FaUser />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropDown>
    );
  };
  const SignInButton = () => {
    return (
      <React.Fragment>
        <Button type="secondary" onClick={showAuthModal}>
          <span className="text-lg">
            <AiOutlineLogin />
          </span>
          <span>Sign in</span>
        </Button>
      </React.Fragment>
    );
  };
  return (
    <div className="mt-4 md:mt-0">
      {user ? <UserAvatar /> : <SignInButton />}
      <RenderAuthModal>
        <SignupOrSignIn hide={hideAuthModal} />
      </RenderAuthModal>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, { signOut })(Auth);
