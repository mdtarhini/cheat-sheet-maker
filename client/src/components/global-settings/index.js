//components
import SignupOrSignIn from "../navbar/SignupOrSignIn";
import Layout from "../common/Layout";
import Alert from "../common/Alert";
import Button from "../common/Button";
import Select from "../common/Select";
//react
import { useState, useEffect } from "react";
//custom hooks
import { useModal } from "../common/Modal/useModal";
//redux
import { connect } from "react-redux";
import {
  updateSheet,
  createSheet,
  getAndSetSheet,
} from "../../actions/sheet-maker";
//router
import history from "../../history";
import {
  HOME_PATH,
  NEW_SHEET_PATH,
  SHEET_MAKER_PATH,
} from "../../routes/paths";
//others
import {
  cellThemeOptions,
  cellCornerOptions,
  cellBorderOptions,
  highlightingLangOptions,
} from "../../sheet-settings-constants";

const GlobalSettings = ({
  auth,
  match,
  updateSheet,
  createSheet,
  ongoingOnServer,
  sheetMaker,
}) => {
  const [RenderAuthModal, showAuthModal, hideAuthModal] = useModal();
  const sheetId = match?.params?.id;
  const sheetAuthorId = sheetMaker?.authorId;
  const [formValues, setFormValues] = useState({
    title: "",
    maxCols: "2",
    defaultLang: "javascript",
    theme: "blue",
    borders: "zero",
    corners: "none",
  });

  useEffect(() => {
    if (!auth.user) {
      showAuthModal();
    }
  }, [auth, showAuthModal]);

  useEffect(() => {
    if (match.path !== NEW_SHEET_PATH) {
      if (!sheetMaker?.title) {
        history.push(`${SHEET_MAKER_PATH}/${sheetId}`);
      } else {
        const {
          maxCols,
          title,
          corners,
          defaultLang,
          theme,
          borders,
        } = sheetMaker;
        setFormValues((values) => {
          return {
            ...values,
            maxCols,
            title,
            corners,
            defaultLang,
            borders,
            theme,
          };
        });
      }
    }
  }, [sheetMaker, match, sheetId]);

  const createOrUpdateSheet = () => {
    if (match.path === NEW_SHEET_PATH) {
      createSheet({ ...formValues });
    } else {
      updateSheet(
        sheetId,
        { ...formValues, cells: sheetMaker.cells },
        `${SHEET_MAKER_PATH}/${sheetId}`
      );
    }
  };

  const handleInputChange = (event) => {
    const target = event.target;

    setFormValues({ ...formValues, [target.name]: target.value });
  };
  const handleCancel = (event) => {
    event.preventDefault();
    if (match.path === NEW_SHEET_PATH) {
      history.push(HOME_PATH);
    } else {
      history.push(`${SHEET_MAKER_PATH}/${sheetId}`);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    createOrUpdateSheet();
  };

  /*
  Form groups:
  1- title (text)
  2- sheet layout (radio)
  3- cell theme (radio)
  4- cell border radius (radio)
  */

  const sheetTitle = () => {
    return (
      <>
        <label htmlFor="title" className="text-blue-500 text-sm font-semibold">
          Sheet title
        </label>

        <input
          type="text"
          required
          onChange={handleInputChange}
          value={formValues["title"]}
          name="title"
          className="w-full h-12 px-2 rounded-md  placeholder-gray-400  bg-white text-lg focus-yellow hover:bg-gray-50"
          placeholder="Title "
        />
      </>
    );
  };

  const layoutRadio = () => {
    return (
      <div className="flex flex-wrap">
        {["1", "2", "3"].map((option) => {
          return (
            <label
              className="relative flex items-center  space-x-2 bg-gray-300 text-gray-700 px-2 py-1 rounded-md mr-6"
              key={option}
            >
              <input
                onChange={handleInputChange}
                checked={formValues["maxCols"] === option}
                type="radio"
                name="maxCols"
                value={option}
                id={option}
              />
              <span htmlFor={option}>{option}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const defaultLangSelect = () => {
    const options = Object.keys(highlightingLangOptions).map((langKey) => {
      return { value: langKey, label: highlightingLangOptions[langKey].label };
    });
    return (
      <>
        <label
          htmlFor="defaultLang"
          className="text-blue-500 text-sm font-semibold"
        >
          Default language for code highlighting
        </label>

        <div className="w-full md:w-72 h-10">
          <Select
            value={formValues.defaultLang}
            id="defaultLang"
            options={options}
            searchable={true}
            onValueChange={(value) =>
              setFormValues({ ...formValues, defaultLang: value })
            }
            buttonClassName="rounded-md "
          />
        </div>
      </>
    );
  };

  const themeRadio = () => {
    return (
      <div className="flex flex-wrap">
        {Object.keys(cellThemeOptions).map((optionKey) => {
          return (
            <div
              className="relative flex flex-col justify-center items-center mr-3 mb-2"
              key={optionKey}
            >
              <input
                className="absolute"
                onChange={handleInputChange}
                checked={formValues["theme"] === optionKey}
                type="radio"
                name="theme"
                id={optionKey}
                value={optionKey}
              />
              <label htmlFor={optionKey}>
                <div
                  className={`border-2 rounded-sm overflow-hidden border-${cellThemeOptions[optionKey]}-600`}
                >
                  <span className="sr-only">{optionKey}</span>
                  <div
                    className={`w-20 h-6 flex justify-center items-center text-sm bg-${cellThemeOptions[optionKey]}-500`}
                  ></div>
                  <div
                    className={`w-20 h-6 bg-${cellThemeOptions[optionKey]}-50`}
                  ></div>
                  <div
                    className={`w-20 h-6 bg-${cellThemeOptions[optionKey]}-200`}
                  ></div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const bordersRadio = () => {
    return (
      <div className="flex flex-wrap">
        {Object.keys(cellBorderOptions).map((optionKey) => {
          return (
            <div
              className="relative flex flex-col justify-center items-center mr-3 mb-2"
              key={optionKey}
            >
              <input
                onChange={handleInputChange}
                checked={formValues["borders"] === optionKey}
                className="absolute"
                type="radio"
                name="borders"
                value={optionKey}
                id={optionKey}
              />
              <label htmlFor={optionKey}>
                <div
                  className={`w-20 h-14 flex justify-center text-sm bg-gray-300 border-gray-700 
                  border${cellBorderOptions[optionKey]}`}
                >
                  <span className={`sr-only`}>{optionKey}</span>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const roundedRadio = () => {
    return (
      <div className="flex flex-wrap">
        {Object.keys(cellCornerOptions).map((optionKey) => {
          return (
            <div
              className="relative flex flex-col justify-center items-center mr-3 mb-2"
              key={optionKey}
            >
              <input
                onChange={handleInputChange}
                checked={formValues["corners"] === optionKey}
                className="absolute"
                type="radio"
                name="corners"
                value={optionKey}
                id={optionKey}
              />
              <label htmlFor={optionKey}>
                <div
                  className={`w-20 h-14 flex justify-center text-sm bg-gray-400 rounded-${cellCornerOptions[optionKey]}`}
                >
                  <span className="sr-only">{optionKey}</span>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const ActionButtons = () => {
    return (
      <fieldset className="w-full flex items-center justify-center md:justify-end space-x-2">
        <Button onClick={handleCancel} type="open" color="red">
          Cancel
        </Button>
        <Button type="primary" loading={ongoingOnServer["saving-sheet"]}>
          <span>{match.path === NEW_SHEET_PATH ? "Continue" : "Save"}</span>
        </Button>
      </fieldset>
    );
  };

  const MainContent = () => {
    return (
      <main className="bg-blue-100 rounded-xl py-10 px-2 md:px-5 lg:px-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-8">
            {/* Title */}
            <div className="flex flex-col space-y-1">{sheetTitle()}</div>
            {/* preferred lang */}
            <div className="flex flex-col space-y-1">{defaultLangSelect()}</div>
            {/* Radio groups */}
            {[
              {
                id: "layout",
                legend: "Maximum number of columns",
                group: layoutRadio,
              },
              {
                id: "theme",
                legend: "Cell color theme",
                group: themeRadio,
              },
              {
                id: "borders",
                legend: "Cell borders",
                group: bordersRadio,
              },
              {
                id: "corners",
                legend: "Cell corners",
                group: roundedRadio,
              },
            ].map((item) => {
              return (
                <fieldset className="flex flex-col space-y-1" key={item.id}>
                  <legend className="text-sm font-semibold text-blue-500">
                    {item.legend}
                  </legend>
                  {item.group()}
                </fieldset>
              );
            })}

            {ActionButtons()}
          </div>
        </form>
      </main>
    );
  };

  const AuthErrorContent = () => {
    return (
      <main>
        <Alert type="error" text="You are not authorized to edit this sheet" />
      </main>
    );
  };
  const NoAuthContent = () => {
    return (
      <main>
        <Alert type="error" text="Please sign in to view this page" />
      </main>
    );
  };

  const ConditionalRender = () => {
    if (match.path === NEW_SHEET_PATH) {
      return MainContent();
    } else {
      if (auth?.user) {
        if (auth?.user?._id === sheetAuthorId) {
          return MainContent();
        } else {
          return AuthErrorContent();
        }
      } else {
        return NoAuthContent();
      }
    }
  };

  return (
    <Layout>
      <div>
        {ConditionalRender()}
        <RenderAuthModal>
          <SignupOrSignIn
            onClose={() => {
              history.push(HOME_PATH);
            }}
            hide={hideAuthModal}
          />
        </RenderAuthModal>
      </div>
    </Layout>
  );
};
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    ongoingOnServer: state.ongoingOnServer,
    sheetMaker: state.sheetMaker,
  };
};
export default connect(mapStateToProps, {
  updateSheet,
  createSheet,
  getAndSetSheet,
})(GlobalSettings);
