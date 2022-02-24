import { useEffect, useState } from "react";
import useGuest from "../hooks/useGuest";
import useTable from "../hooks/useTable";

const Home = () => {
  const [search, setSearch] = useState("");
  const [dataView, setDataView] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [listData, loading, getData, sendData, deleteData, editData] = useGuest();
  const [listTable, , getTable, , ,] = useTable();
  const [selectedData, setSelectedData] = useState(null);
  const [tableOption, setTableOption] = useState([]);
  const [tableSearch, setTableSearch] = useState("");
  const [tempDataView, setTempDataView] = useState([]);

  useEffect(() => {
    getData();
    getTable();
  }, []);

  useEffect(() => { setTempDataView(listData) }, [listData])

  useEffect(() => {
    if (tempDataView.length > 0 && listTable.length > 0) {
      const tempOption = listTable.map(item => {
        let onTable = tempDataView.filter(guest => guest.tableId === item.id);
        let total = onTable.reduce((prev, current) => prev + current.sum, 0);
        return {
          ...item,
          totalGuest: total
        }
      });
      setTableOption(tempOption);
    }
  }, [tempDataView, listTable]);

  useEffect(() => {
    setSelectedData(null);
    let tempData = tempDataView.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    if (tableSearch !== "") {
      tempData = tempData.filter(item => item.tableId === tableSearch);
    }
    setDataView(tempData);
  }, [tempDataView, search, tableSearch]);

  const handleChange = (e) => {
    setSelectedData(temp => ({ ...temp, [e.target.name]: e.target.value }));
  }

  const generateTableName = (id) => {
    return listTable?.filter(item => item.id === id)[0]?.name || "";
  }

  const handleCheck = (e) => {
    const checkedRow = tempDataView.map(item => {
      if (item.id === e.target.value) {
        item.attend = e.target.checked;
        editData(e.target.value, item);
      }
      return item;
    })
    setTempDataView(checkedRow);
  }

  const handleRadio = (e) => {
    if (e.target.value === "all") setDataView(tempDataView);
    else if (e.target.value === "true") {
      const filtered = tempDataView.filter(item => item.attend === true)
      setDataView(filtered)
    } else {
      const filtered = tempDataView.filter(item => item.attend === false || item.attend === null)
      setDataView(filtered)
    }
  }

  return (
    <div className="w-full h-screen p-5">
      <div className="text-2xl">Guests</div>
      <div className="w-full flex flex-row justify-end items-center mt-10">
        <button className="bg-green-600 text-white text-sm p-2 rounded" onClick={() => setShowModal(true)}>Add New Guest</button>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row justify-start items-center mt-5 gap-10">
          <label>Search</label>
          <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="By name" className="border rounded p-1" />
        </div>
        <div className="flex flex-row justify-start items-center mt-5 gap-10">
          <label>Table</label>
          <select onChange={(e) => setTableSearch(e.target.value)} className="border rounded p-1">
            <option value={""}>-- Select One --</option>
            {tableOption.map(item =>
              <option value={item.id} key={item.id}>{`${item.name} - (${item.totalGuest} Guests)`}</option>
            )}
          </select>
        </div>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row justify-start items-center mt-5 gap-10">
          <input type="radio" onChange={handleRadio} name="attend" value={"true"} className="border rounded p-1" />
          <label>Attend</label>
          <input type="radio" onChange={handleRadio} name="attend" value={"false"} className="border rounded p-1" />
          <label>Not Attend</label>
          <input type="radio" onChange={handleRadio} name="attend" value={"all"} className="border rounded p-1" />
          <label>All</label>
        </div>
      </div>
      <table className="min-w-full table-auto mt-10">
        <thead className="border-b">
          <tr className="">
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">No</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Attend</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Name</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Table</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Sum</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ?
            <tr><td colSpan={4} className=" text-center">Loading...</td></tr>
            :
            dataView.length === 0 ?
              <tr><td colSpan={4} className=" text-center">No data</td></tr>
              :
              dataView.map((item, i) =>
                <tr className="border-b" key={item.id}>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{i + 1}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" checked={item.attend} onChange={handleCheck} value={item.id} />
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{generateTableName(item.tableId)}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.sum}</td>
                  <td className="flex flex-row justify-end items-center h-full gap-3 px-6 py-4 ">
                    <button className="bg-green-300 text-white w-20 rounded" onClick={() => {
                      setShowModal(true);
                      setSelectedData(item);
                    }}>Edit</button>
                    <button className="bg-red-400 text-white w-20 rounded" onClick={() => deleteData(item.id)}>Delete</button>
                  </td>
                </tr>
              )}
        </tbody>
      </table>
      <div className={`${!showModal && "hidden"} modal fade fixed top-0 left-0 w-screen h-screen outline-none overflow-x-hidden overflow-y-auto flex justify-center items-center bg-black bg-opacity-20`}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                Add New Guest
              </h5>
            </div>
            <div className="modal-body relative p-4 flex flex-col gap-5">
              <div className="flex flex-row gap-10 justify-between items-center">
                <label>Name</label>
                <input type="text" onChange={handleChange} name="name" value={selectedData?.name || ""} placeholder="Name" className="border rounded p-1 w-64" />
              </div>
              <div className="flex flex-row gap-2 justify-between items-center">
                <label>Table</label>
                <select name="tableId" onChange={handleChange} value={selectedData?.tableId || ""} className="border rounded p-1 w-64">
                  <option>-- Select One --</option>
                  {tableOption.map(item =>
                    <option value={item.id} key={item.id}>{`${item.name} - (${item.totalGuest} Guests)`}</option>
                  )}
                </select>
              </div>
              <div className="flex flex-row gap-2 justify-between items-center">
                <label>Total</label>
                <input name="sum" onChange={handleChange} value={selectedData?.sum || ""} type="number" placeholder="Total Guest" className="border rounded p-1 w-64" />
              </div>
            </div>
            <div
              className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <button
                onClick={() => {
                  setSelectedData(null);
                  setShowModal(false);
                }}
                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                data-bs-dismiss="modal">
                Close
              </button>
              <button
                onClick={() => {
                  if (selectedData.id) {
                    editData(selectedData.id, selectedData);
                  } else {
                    sendData(selectedData?.name, selectedData?.tableId, selectedData?.sum);
                  }
                  setShowModal(false);
                }}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;