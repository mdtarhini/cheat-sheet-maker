//react
import { useEffect } from "react";
//custom hooks
import { useGetUserInfo } from "../../custom-hooks";
//redux
import { connect } from "react-redux";
import { getNonPublishedSheets } from "../../actions/sheets";
//components
import SheetList from "../sheet-list";
import NonPublishedSheetList from "./NonPublishedSheetList";
import Layout from "../common/Layout";

const User = ({ match, auth, getNonPublishedSheets }) => {
  const userId = match.params.id;
  const userInfo = useGetUserInfo(userId);

  useEffect(() => {
    if (auth?.user?._id === userId) {
      getNonPublishedSheets();
    }
  }, [getNonPublishedSheets, auth, userId]);

  return (
    <Layout>
      <div className="pb-10 flex-grow flex flex-col">
        <main className="flex-grow bg-blue-100 rounded-xl py-10 px-2 md:px-5 lg:px-10">
          <SheetList
            listTitle={
              userInfo?._id
                ? userInfo?._id === auth?.user?._id
                  ? "My published sheets"
                  : `Sheets made by ${userInfo?.username}`
                : ""
            }
          />

          {auth?.user?._id === userId && <NonPublishedSheetList />}
        </main>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, { getNonPublishedSheets })(User);
