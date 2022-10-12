import React, { useEffect, useState } from "react";
import { FcOpenedFolder, FcFile } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import TopBar from "./Navbar";
import "../css/loader.css";

function Loader({ socket }) {
  const [files, setFiles] = useState([]);
  const [logsDir, setLogsDir] = useState("..");
  const navigate = useNavigate();

  useEffect(() => {
    // requesting the log files
    socket.emit("get_log_files");

    // handling the signals
    socket.on("log_files", (logs) => {
      setLogsDir(logs.path);
      setFiles(logs.files);
    });

    socket.on("log_selected", (ok) => {
      if (ok) navigate("/home");
      else alert("unsupported format");
    });

    // when recieving entities from jupyter notebook
    socket.on("entities_loaded", () => {
      navigate("/home");
    });
  }, []);

  const parse = (file) => {
    socket.emit("select_log_file", file);
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("log", file, file.name);
    fetch("http://localhost:5000/upload_log", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) navigate("/home");
        else alert("unsupported format");
      });
  };

  return (
    <>
      <TopBar page="loader" />
      <br />
      <center>
        <label
          htmlFor="fileUpload"
          className="file-upload btn btn-warning btn-lg rounded-pill shadow"
        >
          <i className="fa fa-upload mr-2"></i>Browse for file
          <input id="fileUpload" type="file" onChange={handleChange} />
        </label>
      </center>
      <br />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 my-auto">
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <th className="align-middle">
                    <FcOpenedFolder />
                  </th>
                  <th className="align-middle">{logsDir}</th>
                  <th className="align-middle">Size</th>
                  <th className="align-middle">Modified</th>
                </tr>
                {files.map((file, i) => {
                  return (
                    <tr
                      key={i}
                      className="clickable"
                      onClick={() => parse(file)}
                    >
                      <td className="icon-row">
                        <FcFile />
                      </td>
                      <td>{file[0]}</td>
                      <td>
                        {/* TODO: a cleaner way to convert */}
                        {file[1] < 1048576
                          ? (file[1] / 1024).toFixed(2) + " KB"
                          : (file[1] / 1048576).toFixed(2) + " MB"}
                      </td>
                      <td>{file[2]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loader;
