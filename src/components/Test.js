import "../../node_modules/react-grid-layout/css/styles.css";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import { WidthProvider, Responsive } from "react-grid-layout";
import Graph from "./Graph";
import GraphXY from "./GraphXY";
import { v4 as uuid } from "uuid";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Test() {
  const [graphs, setGraphs] = useState([]);
  const [rowHeight, setRowHeight] = useState(window.innerHeight);

  useEffect(() => {
    fitGraphsToScreen();
  }, [graphs]);

  const addGraphYT = () => {
    const id = uuid();
    const graph = (
      <div key={id} style={{ backgroundColor: "red" }}>
        <Graph id={id} updateKeys={updateKeys} removeGraph={removeGraph} />
      </div>
    );
    setGraphs([...graphs, graph]);
  };

  const addGraphXY = () => {
    const id = uuid();
    const graph = (
      <div key={id} style={{ backgroundColor: "red" }}>
        <GraphXY id={id} updateKeys={updateKeys} removeGraph={removeGraph} />
      </div>
    );
    setGraphs([...graphs, graph]);
  };

  const removeGraph = (id) => {
    const g = graphs.filter((e) => e.id != id);
    setGraphs(g);
  };

  const fitGraphsToScreen = () => {
    const containers = document.getElementsByClassName("plot-yt");
    const multiselects = document.getElementsByClassName("multiselect");
    var additionalHeight = 0; // buttons + navbar height
    for (var i = 0; i < multiselects.length; i++)
      additionalHeight += multiselects[i].clientHeight;
    const plotHeight =
      (window.innerHeight - additionalHeight) / containers.length;
    for (var j = 0; j < containers.length; j++)
      containers[j].style.height = plotHeight + "px";
    setRowHeight(plotHeight + 38);
  };

  const updateKeys = () => {};
  return (
    <>
      <TopBar addYT={addGraphYT} addXY={addGraphXY} />
      <ResponsiveGridLayout
        isResizable={false}
        margin={[0, 0]}
        rowHeight={rowHeight}
        className="layout"
        cols={{ lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }}
        draggableHandle=".plot-options"
      >
        {graphs}
      </ResponsiveGridLayout>
    </>
  );
}

export default Test;
