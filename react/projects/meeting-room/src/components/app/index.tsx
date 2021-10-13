/**
 * Copyright (c) 2021 MeetOnline.io
 *
 * long description for the file
 *
 * @summary App Component
 * @author Rishabh <rishabh.it.007@gmail.com>
 *
 * Created at     : 2021-02-26 12:00:00 
 * Last modified  : 2021-02-26 12:00:00 
 */
import React from "react";
import Header from "../header";
import Home from '../views/home';
import Loading from '../views/loading';
import MeetingRoom from '../views/meetingRoom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Bye from "../views/bye";
import NotFound from "../views/404";
import { Views } from '../../constants';
import { viewSelector } from "../../recoil/atoms/view";
import { useRecoilState, useRecoilValue } from 'recoil';
import Emoji from '../common/emoji';
import layoutStates from "../../recoil/atoms/layout";

const App = () => {
  const view = useRecoilValue(viewSelector);
  const [showHeader, setShowHeader] = useRecoilState(layoutStates.showHeader)

  React.useEffect(() => {
    if (view !== Views.MEETING_ROOM) {
      setShowHeader(true)
    }
  }, [view, setShowHeader])


  const displayComponent = (view: string) => {
    switch (view) {
      case Views.MEETING_ROOM:
        return <MeetingRoom />;

      case Views.BYE:
        return <Bye />;
      case Views.HOME:
        return <Home />;

      case Views.NOT_FOUND:
        return <NotFound />;

      default:
        return <Loading />;
    }
  }

  return (
    <Router>
      {showHeader && (
        <Header />
      )}

      <Switch>
        <Route
          path='/'
          render={() => displayComponent(view)}
        />
      </Switch>
      <Emoji />
    </Router>
  );
};
export default App;
