import { useState } from "react";
import request from "./request";

const useTable = () => {
  const [listTable, setlistTable] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const data = await request({
        method: "GET",
        url: "/table"
      });

      setlistTable(data.data.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const sendData = async (name) => {
    try {
      setLoading(true);
      const data = await request({
        method: "POST",
        url: "/table",
        data: {
          name: name
        }
      })

      getData();
    } catch (error) {
      setLoading(false);
    }
  }

  const deleteData = async (id) => {
    try {
      setLoading(true);
      const data = await request({
        method: "DELETE",
        url: `/table/${id}`,
      })

      getData();
    } catch (error) {
      setLoading(false);
    }
  }

  const editData = async (id, data) => {
    try {
      delete data.id;
      setLoading(true);
      const update = await request({
        method: "PUT",
        url: `/table/${id}`,
        data: data,
      })

      getData();
    } catch (error) {
      setLoading(false);
    }
  }

  return [listTable, loading, getData, sendData, deleteData, editData];
}

export default useTable;