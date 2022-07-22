import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Top } from "./components/pages";
import { Organization } from "./components/pages/organizations/id";

const App: React.VFC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Top />
        </Route>
        <Route path={"/organizations/:organizationId"}>
          <Organization />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
