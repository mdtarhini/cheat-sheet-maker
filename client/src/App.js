// react
import { useEffect } from "react";
//router
import Routes from "./routes";
//redux
import { connect } from "react-redux";
import { loadUserByToken } from "./actions/auth";

const App = ({ loadUserByToken }) => {
  useEffect(() => {
    loadUserByToken();
  }, [loadUserByToken]);
  return (
    <div className="overflow-x-hidden relative">
      <Routes />
      <div id="modal-root" />
    </div>
  );
};

export default connect(null, { loadUserByToken })(App);
