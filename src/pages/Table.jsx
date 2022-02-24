import { useState, useEffect } from "react";
import useGuest from "../hooks/useGuest";
import useTable from "../hooks/useTable";

const Table = () => {
  const [search, setSearch] = useState("");
  const [dataView, setDataView] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [listTable, loading, getDataTable, sendData, deleteData, editData] = useTable();
  const [listGuest, loadingGuest, getDataGuest] = useGuest();

  useEffect(() => {
    getDataTable();
    getDataGuest();
  }, []);

  useEffect(() => {
    setSelectedData(null);
    const tempData = listTable.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    setDataView(tempData);
  }, [listTable, search]);

  const generateTotal = (id) => {
    let onTable = listGuest.filter(item => item.tableId === id);
    let total = onTable.reduce((prev, current) => prev + current.sum, 0);
    return total;
  }

  return (
    <div className="w-full h-screen p-5">
      <div className="text-2xl">Tables</div>
      <div className="w-full flex flex-row justify-end items-center mt-10">
        <button className="bg-green-600 text-white text-sm p-2 rounded" onClick={() => setShowModal(true)}>Add New Table</button>
      </div>
      <div className="w-full flex flex-row justify-start items-center mt-5 gap-10">
        <label>Search</label>
        <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="By table name" className="border rounded p-1" />
      </div>
      <table className="min-w-full table-auto mt-10">
        <thead className="border-b">
          <tr className="">
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Table Name</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Total Guest</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {(loading || loadingGuest) ?
            <tr><td colSpan={2} className=" text-center">Loading...</td></tr>
            :
            dataView.length === 0 ?
              <tr><td colSpan={2} className=" text-center">No data</td></tr>
              :
              dataView.map(item =>
                <tr className="border-b" key={item.id}>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{generateTotal(item.id)}</td>
                  <td className="flex flex-row justify-end items-center h-full gap-3 px-6 py-4 ">
                    <button className="bg-green-300 text-white w-20 rounded" onClick={() => {
                      setSelectedData(item);
                      setShowModal(true);
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
                Add New Table
              </h5>
            </div>
            <div className="modal-body relative p-4 flex flex-col gap-5">
              <div className="flex flex-row gap-10 justify-between items-center">
                <label>Table Name</label>
                <input
                  name="name"
                  value={selectedData?.name || ""}
                  onChange={(e) => setSelectedData(item => ({ ...item, name: e.target.value }))}
                  type="text"
                  placeholder="Name"
                  className="border rounded p-1 w-64" />
              </div>
            </div>
            <div
              className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <button type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedData(null);
                }}
                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                data-bs-dismiss="modal">
                Close
              </button>
              <button type="button"
                onClick={() => {
                  if (selectedData.id) {
                    editData(selectedData.id, selectedData)
                  } else {
                    sendData(selectedData.name);
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

export default Table;