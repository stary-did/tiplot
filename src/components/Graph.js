import Select from "react-select";
import Plot from "react-plotly.js";
import { useState, useEffect } from "react";
import GraphOptions from "./GraphOptions";
import PlotData from "../models/PlotData";

function Graph({ id }) {
  const plotData = new PlotData(id);
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    const opt = await plotData.getOptions();
    setOptions(opt);
  }

  const addData = async (field) => {
    const d = await plotData.getData(field);
    setData([...data, d]);
  }

  const removeData = (field) => {
    const d = data.filter((e) => e.name != `${field.key}/${field.column}`);
    setData(d);
  }

  const handleSelectChange = (keysList, actionMeta) => {
    switch (actionMeta.action) {
      case "select-option":
        addData(actionMeta.option.value);
        break;
      case "remove-value":
      case "pop-value":
        removeData(actionMeta.removedValue.value);
        break;
      case "clear":
        setData([]);
        break;
      default:
        break;
    }
  }

  const handleHover = (event) => {
    const x = event.points[0].x;
    const n = event.points[0].data.x.length;
    const idx = event.points[0].pointIndex;
    if (event.event.altKey) {
      plotData.updateTimelineIndicator(x, idx / n);
    }
  }

  return (
    <div>
      <Select
        id={`select-${id}`}
        className="multiselect"
        isMulti
        options={options}
        onChange={handleSelectChange}
        // value={selectedValue}
        closeMenuOnSelect={false}
      />
      <div className="d-flex resizable">
        <Plot
          className="plot-yt"
          divId={`plot-${id}`}
          data={data}
          // onRelayout={relayoutHandler}
          onHover={handleHover}
          // onClick={handleClick}
          useResizeHandler
          layout={{
            autoresize: true,
            showlegend: true,
            legend: {
              x: 1,
              xanchor: "right",
              y: 1,
            },
            margin: {
              t: 10,
              b: 25,
              l: 50,
              r: 25,
            },
            hovermode: "x unified"
          }}
          config={{
            displayModeBar: false,
          }}
        />

        <GraphOptions
          plotId={`plot-${id}`}
          graphIndex={id}
        // removeGraph={removeGraph}
        />
      </div>
    </div>
  );
}
export default Graph;
