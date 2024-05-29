import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState([]);

  const fetch = async () => {
    const snapshot = await getDocs(collection(db, "users")); // ดึงข้อมูลจากคอลเล็กชัน "CRUD" ใน Firestore โดยใช้ getDocs
    const dataF = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // แปลงข้อมูลจาก snapshot เป็นรูปแบบที่ต้องการ (รวมถึง id ของเอกสาร)

    setData(dataF);
    // console.log("fetchData:", fetchData);
  };
  useEffect(() => {
    fetch();
  }, []);



    // ## Delete data
    const del = async (id) => {
      const delref = doc(collection(db, "users"), id);
      try {
        await deleteDoc(delref);
        alert("Delete successfully");
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    };


  return (
    <>
      <Navbar />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Age</th>
              <th scope="col">images</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, key) => (
              <tr key={key}>
                <th scope="row">{val.name}</th>
                <td>{val.age}</td>
                <td><img width={100} height={50} src={val.imageUrl}/></td>
                <td><Link to={`edit/${val.id}`}>Edit</Link></td>
                <td><button onClick={() => del(val.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
