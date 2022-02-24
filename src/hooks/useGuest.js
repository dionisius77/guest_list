import { useState } from "react";
import request from "./request";

const useGuest = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      // setLoading(true);
      const data = await request({
        method: "GET",
        url: "/guest"
      });

      setListData(data.data.rows);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
    }
  }

  const sendData = async (name, tableId, sum) => {
    try {
      setLoading(true);
      const data = await request({
        method: "POST",
        url: "/guest",
        data: {
          name, tableId, sum
        }
      })

      getData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const deleteData = async (id) => {
    try {
      setLoading(true);
      const data = await request({
        method: "DELETE",
        url: `/guest/${id}`,
      })

      getData();
    } catch (error) {
      setLoading(false);
    }
  }

  const editData = async (id, dataSend) => {
    try {
      delete dataSend.id;
      // setLoading(true);
      const data = await request({
        method: "PUT",
        url: `/guest/${id}`,
        data: dataSend,
      })

      getData();
    } catch (error) {
      // setLoading(false);
    }
  }

  return [listData, loading, getData, sendData, deleteData, editData];
}

export default useGuest;