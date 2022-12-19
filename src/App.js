import "./static/css/overlay.css";
import Loader from "./components/Loader";
import Settings from "./components/Settings";
import Test from "./components/Test";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import SplitLayout from "./layouts/SplitLayout";

function App() {
  const [socketInstance, setSocketInstance] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000/", {
      transports: ["websocket"],
      // cors: {
      //   origin: "http://localhost:3000/",
      // },
    });

    setSocketInstance(socket);

    socket.on("connect", () => {
      // console.log("Connected");
    });

    socket.on("entities_loaded", () => {
      console.log("app recieved the signal");
      // navigate("/home");
    });

    socket.on("disconnect", () => {
      // console.log("Disconnected");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("entities_loaded");
    };
    // return function cleanup() {

    //   socket.disconnect();
    // };
  }, []);

  // return <Test />;

  if (socketInstance === "") return <div>Loading</div>;
  else
    return (
      <>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={<Loader socket={socketInstance} />}
            />
            <Route
              path="/home"
              element={<SplitLayout socket={socketInstance} />}
            />
            <Route exact path="/settings" element={<Settings />} />
            <Route path="*" element={"not found"} />
          </Routes>
        </Router>
      </>
    );
}

export default App;
