import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { AiFillSetting } from "react-icons/ai";
import { BsFillFunnelFill } from "react-icons/bs";

import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider";

import "./Table.css";
import "react-datepicker/dist/react-datepicker.css";

import Pagination from "../Pagination/Pagination";
import { Paginate } from "../Pagination/Paginate";

function Table() {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const options = [
    { name: "Ad Requests", api_name: "requests", bool: true },
    { name: "Ad Response", api_name: "responses", bool: true },
    { name: "Impressions", api_name: "impressions", bool: true },
    { name: "Clicks", api_name: "clicks", bool: true },
    { name: "Revenue", api_name: "revenue", bool: true },
    { name: "Fill Rate", api_name: "fillRate", bool: true },
    { name: "CTR", api_name: "ctr", bool: true },
  ];

  const [settingsOpen, setSettingsOpen] = useState(false);
  const todayDate = new Date().toISOString().slice(0, 10);
  const [values, setValues] = useState([]);
  const [values2, setValues2] = useState([]);

  const [appNames, setAppNames] = useState([]);
  const [filters, setFilters] = useState(options);

  const [from, setFrom] = useState(todayDate);
  const [to, setTo] = useState(todayDate);

  const [searchAppOpen, setSearchAppOpen] = useState(false);
  const [selectedApps, setSelectedApps] = useState([]);

  const [filterRevenueOpen, setFilterRevenueOpen] = useState(false);
  const [filterRange, setFilterRange] = useState({ min: 0, max: 500 });

  const [appsCopyValue, setAppsCopyValue] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const alldata = Paginate(values, currentPage, 9);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const inSelectedAppsList = (app) => {
    let res = 0;

    selectedApps.map((item) => {
      if (item.app_name === app) res = 1;
    });

    // console.log(app, res);
    return res;
  };

  useEffect(() => {
    from &&
      to &&
      axios
        .get("http://go-dev.greedygame.com/v3/dummy/apps")
        .then((res) => setAppNames(res.data.data))
        .catch((err) => console.log(err));

    axios
      .get(
        `https://go-dev.greedygame.com/v3/dummy/report?startDate=${from}&endDate=${to}`
      )
      .then((res) => {
        setValues(res.data.data);
        setValues2(res.data.data);
      })
      .catch((err) => console.log(err));

    setSelectedApps([]);

    setFilterRange({ min: 0, max: 500 });

    setAppsCopyValue([]);
  }, [from, to, filters]);

  const findAppName = (id) => {
    let res;
    appNames.map((item) => {
      if (item.app_id === id) res = item.app_name;
    });

    return res;
  };

  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const drop = (e) => {
    const copyListItems = [...filters];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFilters(copyListItems);
  };

  return (
    <div className="main">
      <div className="settingsTab">
        <div className="datePicker">
          <div className="fromTo">
            <div className="fromItems">
              <label htmlFor="to">From Date:</label>
              <input
                type="date"
                name="from"
                value={from}
                id="from"
                onChange={(e) => {
                  return setFrom(e.target.value);
                }}
              />
            </div>

            <div style={{ marginLeft: "10px" }} className="fromItems">
              <label htmlFor="to">To Date:</label>
              <input
                type="date"
                name="to"
                value={to}
                id="to"
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div
          className="settings"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <div>
            <AiFillSetting />
          </div>
          <div style={{ marginLeft: "3px" }}> Settings</div>
        </div>
      </div>

      {settingsOpen && (
        <div className="settingsOpen">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Dimensions and Matrics</div>
            <div
              style={{
                height: "20px",
                width: "50px",
                margin: "5px",
                padding: "5px",
                backgroundColor: "whitesmoke",
              }}
              onClick={() => {
                setSettingsOpen(false);
              }}
            >
              Close
            </div>
          </div>

          <div className="pills">
            <div className="pill extraPill">Date</div>
            <div className="pill extraPill">AppName</div>

            {filters.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    const newOptions = [...filters];

                    newOptions.map((i) =>
                      i.name === item.name ? (i.bool = !i.bool) : null
                    );

                    setFilters(newOptions);

                    // console.log(filters);
                  }}
                  className="pill"
                  draggable
                  onDragStart={(e) => dragStart(e, index)}
                  onDragEnter={(e) => dragEnter(e, index)}
                  onDragEnd={drop}
                >
                  <div
                    style={{
                      backgroundColor: item.bool ? "lightblue" : "lightgrey",
                      width: "10px",
                    }}
                  ></div>
                  <div style={{ paddingLeft: "3px", alignSelf: "center" }}>
                    {item.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <table className="table">
        <tbody>
          <tr className="tr">
            <th scope="col">
              <div className="tableCol">
                <div> Date</div>
              </div>
            </th>
            <th scope="col">
              <div className="tableCol">
                <div
                  onClick={() => {
                    setSearchAppOpen(!searchAppOpen);
                  }}
                >
                  <BsFillFunnelFill />
                </div>
                <div> App Name</div>
              </div>

              {searchAppOpen && !settingsOpen && (
                <div
                  style={{
                    position: "absolute",
                    height: "23vh",
                    width: "15vw",
                    backgroundColor: "#C0C0C0",
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px",
                  }}
                >
                  <div style={{ textAlign: "left" }}>Select App</div>
                  <div>
                    {/* {console.log(appNames)} */}
                    {appNames?.map((appName, index) => (
                      <div
                        style={{
                          backgroundColor: inSelectedAppsList(appName.app_name)
                            ? "lightblue"
                            : "whitesmoke",
                          margin: "3px",
                        }}
                        onClick={() => {
                          if (inSelectedAppsList(appName.app_name)) {
                            setSelectedApps(
                              selectedApps.filter(
                                (item) => item.app_name !== appName.app_name
                              )
                            );
                          } else {
                            const newSelectedApps = [...selectedApps, appName];

                            setSelectedApps(newSelectedApps);
                          }
                        }}
                      >
                        {appName.app_name}
                      </div>
                    ))}
                  </div>
                  <div
                    className="apply"
                    onClick={() => {
                      setSearchAppOpen(false);

                      const valuesCopy = [];

                      console.log(values2);

                      values2.map((item) => {
                        if (inSelectedAppsList(findAppName(item.app_id))) {
                          // console.log(item);
                          valuesCopy.push(item);
                        }
                      });

                      setValues(valuesCopy);
                      setAppsCopyValue(valuesCopy);
                    }}
                  >
                    Apply
                  </div>
                </div>
              )}
            </th>

            {filters.map((item) =>
              item.bool ? (
                <th scope="col">
                  <div className="tableCol">
                    {item.name === "Revenue" && (
                      <div
                        onClick={() => {
                          setFilterRevenueOpen(!filterRevenueOpen);
                        }}
                      >
                        <BsFillFunnelFill />
                      </div>
                    )}

                    <div> {item.name}</div>
                  </div>

                  {item.name === "Revenue" &&
                    filterRevenueOpen &&
                    !settingsOpen && (
                      <div
                        style={{
                          position: "absolute",
                          height: "18vh",
                          width: "15vw",
                          backgroundColor: "#C0C0C0",
                          display: "flex",
                          flexDirection: "column",
                          padding: "10px",
                        }}
                      >
                        <div style={{ textAlign: "left" }}>
                          Select Revenue Range
                        </div>

                        <MultiRangeSlider
                          min={0}
                          max={500}
                          onChange={
                            ({ min, max }) => {
                              setFilterRange({ min: min, max: max });
                            }
                            // console.log(`min = ${min}, max = ${max}`)
                          }
                        />

                        <div
                          className="apply"
                          onClick={() => {
                            setFilterRevenueOpen(false);
                            const valuesCopy = [];
                            // console.log(values2);

                            const temp =
                              appsCopyValue.length > 1
                                ? appsCopyValue
                                : values2;

                            temp.map((item) => {
                              if (
                                item.revenue >= filterRange.min &&
                                item.revenue <= filterRange.max
                              ) {
                                valuesCopy.push(item);
                              }
                            });

                            setValues(valuesCopy);
                          }}
                        >
                          Apply
                        </div>
                      </div>
                    )}
                </th>
              ) : null
            )}
          </tr>
          {/* {console.log(values)} */}

          {alldata.map((item, index) => {
            return (
              <tr className="tr" key={index}>
                <td>{item.date.slice(0, 10)}</td>
                <td>{findAppName(item.app_id)}</td>

                {filters.map((i) => {
                  if (i.api_name === "fillRate") {
                    return i.bool ? (
                      <td>
                        {((item.requests / item.responses) * 100)?.toFixed(2)}
                      </td>
                    ) : null;
                  } else if (i.api_name === "ctr") {
                    return i.bool ? (
                      <td>
                        {((item.clicks / item.impressions) * 100)?.toFixed(2)}
                      </td>
                    ) : null;
                  } else if (i.api_name === "revenue") {
                    return i.bool ? (
                      <td>{"$" + item.revenue?.toFixed(2)}</td>
                    ) : null;
                  } else {
                    return i.bool ? <td> {item[i.api_name]}</td> : null;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        itemsCount={values.length}
        pageSize={10}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Table;
