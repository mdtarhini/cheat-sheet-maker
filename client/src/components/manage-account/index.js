//components
import Layout from "../common/Layout";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";
//react
import { useState } from "react";
//redux
import { connect } from "react-redux";
import { editPassword, deleteUser } from "../../actions/auth";

const ManageAccount = ({ auth, ongoingOnServer, editPassword, deleteUser }) => {
  const [values, setValues] = useState({
    "password-for-delete": "",
    "old-password": "",
    "new-password": "",
  });

  const LabelInputPair = ({
    label,
    inputName,
    inputType = "text",
    errKey = "",
  }) => {
    return (
      <div className="flex flex-col space-y-1">
        <div className="w-full md:w-96 flex items-stretch">
          <div className="bg-gray-100 w-1/4 max-w-24 flex-shrink-0 p-1 flex justify-center items-center rounded-l-md">
            <label className="text-gray-600 font-semibold" htmlFor={inputName}>
              {label}
            </label>
          </div>

          <Input
            value={values[inputName]}
            name={inputName}
            id={inputName}
            extra="rounded-l-none w-full"
            inputType={inputType}
            onChange={(event) => {
              setValues((prevState) => {
                return { ...prevState, [inputName]: event.target.value };
              });
            }}
          />
        </div>
        {auth?.errMsg?.for === errKey && (
          <p className="text-red-500 font-semibold text-sm">
            {auth.errMsg.msg}
          </p>
        )}
      </div>
    );
  };

  const MainContent = () => {
    return (
      <main className="bg-blue-100 rounded-xl py-10 px-2 md:px-5 lg:px-10 flex flex-col space-y-6">
        {/* Title */}
        <h1 className="text-xl md:text-2xl text-blue-500 font-semibold">
          Manage your account
        </h1>

        {/* Change password */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg  text-gray-700 font-semibold">
            Change your password
          </h2>
          <div className="flex flex-col space-y-2 ">
            {LabelInputPair({
              inputType: "password",
              label: "old",
              inputName: "old-password",
            })}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              {LabelInputPair({
                inputType: "password",
                label: "new",
                inputName: "new-password",
                errKey: "editing-password",
              })}
              <Button
                type="primary"
                className="h-12"
                disabled={!values["old-password"] || !values["new-password"]}
                loading={ongoingOnServer["editing-password"]}
                onClick={() => {
                  editPassword({
                    oldPassword: values["old-password"],
                    newPassword: values["new-password"],
                  });
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
        {/* Delete account */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg  text-red-500 font-semibold">
            Delete your account
          </h2>
          <div className="flex flex-col md:flex-row  space-y-2 md:space-y-0 md:space-x-2">
            {LabelInputPair({
              inputType: "password",
              label: "password",
              inputName: "password-for-delete",
              errKey: "deleting-user",
            })}

            <Button
              type="primary"
              className="h-12"
              loading={ongoingOnServer["deleting-user"]}
              disabled={!values["password-for-delete"]}
              color="red"
              onClick={() => {
                deleteUser(values["password-for-delete"]);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </main>
    );
  };
  const NoAuthContent = () => {
    return (
      <Alert type="error" text="You need to be signed in to view this page" />
    );
  };
  return <Layout>{auth?.user ? MainContent() : NoAuthContent()}</Layout>;
};

const mapStateToProps = (state) => {
  return { auth: state.auth, ongoingOnServer: state.ongoingOnServer };
};
export default connect(mapStateToProps, {
  editPassword,
  deleteUser,
})(ManageAccount);
