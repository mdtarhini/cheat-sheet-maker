//components
import SheetList from "../sheet-list";
import Layout from "../common/Layout";
import Alert from "../common/Alert";
//redux
import { connect } from "react-redux";

const Favorites = ({ auth }) => {
  return (
    <Layout>
      {auth?.user ? (
        <div className="flex-grow bg-blue-100 rounded-xl py-10 px-2 md:px-5 lg:px-10">
          <SheetList listTitle="My favorites sheets" />
        </div>
      ) : (
        <Alert type="error" text="You need to sign in to view this page" />
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(Favorites);
