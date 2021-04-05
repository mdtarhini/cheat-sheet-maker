import { Switch, Route, Router } from "react-router-dom";
import history from "../history";

//components
import Home from "../components/home";
import Sheet from "../components/sheet";
import User from "../components/user";
import ManageAccount from "../components/manage-account";
import Favorites from "../components/favorites";
import GlobalSettings from "../components/global-settings";
import SheetMaker from "../components/sheet-maker";
import NotFound from "../components/not-found";

//path names (only the origin without the params)
import {
  USER_PATH,
  HOME_PATH,
  MANAGE_ACCOUNT_PATH,
  FAVORITES_PATH,
  SHEET_MAKER_PATH,
  NEW_SHEET_PATH,
  SHEET_SETTINGS_PATH,
  SHEET_PATH,
  SHEET_PREVIEW_PATH,
} from "./paths";

const Routes = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route path={HOME_PATH} exact component={Home} />
          <Route path={`${USER_PATH}/:id`} exact component={User} />
          <Route path={MANAGE_ACCOUNT_PATH} exact component={ManageAccount} />
          <Route path={FAVORITES_PATH} exact component={Favorites} />
          <Route path={`${SHEET_MAKER_PATH}/:id`} component={SheetMaker} />
          <Route path={NEW_SHEET_PATH} component={GlobalSettings} />
          <Route
            path={`${SHEET_SETTINGS_PATH}/:id`}
            component={GlobalSettings}
          />
          <Route path={`${SHEET_PATH}/:id`} component={Sheet} />
          <Route path={`${SHEET_PREVIEW_PATH}/:id`} component={Sheet} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default Routes;
