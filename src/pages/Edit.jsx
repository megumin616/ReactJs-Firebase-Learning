import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default function Edit() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");


  console.log("Data", name, age, id);

  // ฟังก์ชันสำหรับดึงข้อมูลจาก Firestore โดยใช้ id
  const fetch = async (id) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name);
      setAge(data.age);
    } else {
      console.log("No such document!");
    }
  };

  // เรียกใช้ฟังก์ชัน fetchData เมื่อมีการเปลี่ยนแปลงใน id
  useEffect(() => {
    fetch(id);
  }, [id]);

  // ฟังก์ชันสำหรับอัพเดตข้อมูล
  const updateData = async (event) => {
    event.preventDefault(); //ใส่อันนี้ด้วย เมื่อกี้ก็ลืมอีกแล้ว
    const docRef = doc(db, "users", id);
    try {
      await updateDoc(docRef, { name: name, age: age });
      alert("Update successfully");
    //   window.location.reload(); // รีโหลดหน้า
    //   history.push("/form");
    } catch (error) {
      alert("Update Error", error);
    }
  };

  return (
    <>
      <Navbar />
      <form>
        <legend>Edit Data</legend>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="text"
            className="form-control"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn btn-success" onClick={updateData}>
          Save
        </button>
      </form>
    </>
  );
}
