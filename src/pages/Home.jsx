import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loading from "../components/Loading";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //ดึงข้อมูลมาแสดง
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  //หากกำลังโหลดข้อมูล ให้แสดงหน้านี้ก่อน
  if (loading) {
    return <Loading/>
  }

  //Delete data
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete data")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Img</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((item, key) => (
              <tr key={key}>
                <th scope="row">{item.name}</th>
                <td>{item.age}</td>
                <td>
                  <img src={item.img} width={100} height={50} />
                </td>
                <td>
                  <button onClick={() => navigate(`/adddata/${item.id}`)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
