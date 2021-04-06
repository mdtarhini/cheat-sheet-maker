//react
import { useEffect, useState } from "react";
//redux
import { connect } from "react-redux";
import { getAndSetSheet } from "../../actions/sheet-maker";

//components
import Layout from "../common/Layout";
import Button from "../common/Button";
import CellMaker from "./CellMaker";
import CellPreview from "./CellPreview";
import Header from "./Header";
import CellList from "./CellList";
import Loader from "../common/Loader";
import Alert from "../common/Alert";

const SheetMaker = ({
  match,
  sheetMaker,
  auth,
  getAndSetSheet,
  ongoingOnServer,
}) => {
  const [smallScreenView, setSmallScreenView] = useState("editor");

  const sheetId = match.params.id;

  useEffect(() => {
    getAndSetSheet(sheetId);
  }, [sheetId, getAndSetSheet]);

  useEffect(() => {
    setSmallScreenView("editor");
  }, [sheetMaker.selectedCell]);

  const MainContent = () => {
    return (
      <main className="w-full h-full flex-grow overflow-y-hidden">
        <div className="h-full flex flex-col space-y-2 ">
          <Header title={sheetMaker.title} sheetId={sheetId} />
          {/* large screens */}
          <div className="hidden md:flex w-full h-full  space-x-1 overflow-y-hidden">
            <CellList />

            <div className="h-full flex flex-grow space-x-0.5">
              <div className="w-1/2 h-full">
                <CellMaker />
              </div>
              <div className="w-1/2 h-full">
                <CellPreview />
              </div>
            </div>
          </div>
          {/* small screens */}
          <div className="md:hidden w-full h-full flex flex-col space-y-1 overflow-y-hidden">
            <div className="flex w-full h-8">
              <Button
                type="none"
                className={`h-full w-1/2  border border-gray-300 
                ${smallScreenView === "cells" ? "bg-blue-100" : "bg-gray-100"}`}
                onClick={() => setSmallScreenView("cells")}
              >
                Cells
              </Button>
              <Button
                type="none"
                className={`h-full w-1/2 border border-gray-300 
                ${
                  smallScreenView === "editor" ? "bg-blue-100" : "bg-gray-100"
                }`}
                onClick={() => setSmallScreenView("editor")}
              >
                Editor
              </Button>
            </div>
            {smallScreenView === "cells" ? <CellList /> : <CellMaker />}
          </div>
        </div>
      </main>
    );
  };
  const NoAuthContent = () => {
    return (
      <main>
        <Alert type="error" text="Sign in to continue" />
      </main>
    );
  };
  const AuthErrorContent = () => {
    return (
      <main>
        <Alert type="error" text="You are not authoized to edit this sheet" />
      </main>
    );
  };
  const LoadingContent = () => {
    return <Loader />;
  };

  const conditionalRender = () => {
    if (ongoingOnServer["getting-sheet-for-maker"]) {
      return LoadingContent();
    } else {
      if (auth?.user) {
        if (auth?.user?._id === sheetMaker?.authorId) {
          return MainContent();
        } else {
          return AuthErrorContent();
        }
      } else {
        return NoAuthContent();
      }
    }
  };

  return <Layout>{conditionalRender()}</Layout>;
};

const mapStateToProps = (state) => {
  return {
    sheetMaker: state.sheetMaker,
    auth: state.auth,
    ongoingOnServer: state.ongoingOnServer,
  };
};
export default connect(mapStateToProps, {
  getAndSetSheet,
})(SheetMaker);
