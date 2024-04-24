import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

export default function CRUD() {
  // ประกาศ state สำหรับเก็บข้อมูล name, email, และ phone
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [fetchData, setFetchData] = useState([]); //สร้างที่เก็บสำหรับ ขอมูลที่ไปดึงมาใน database

  const [id, setId] = useState();

  // ระบุ reference ไปยังคอลเล็กชัน "CRUD" ใน Firestore database
  const dbref = collection(db, "CRUD");

  // ##ฟังก์ชันสำหรับเพิ่มข้อมูลลงใน Firestore database
  const add = async () => {
    // เรียกใช้ addDoc เพื่อเพิ่มข้อมูลในคอลเล็กชัน "CRUD"
    const adddata = await addDoc(dbref, {
      Name: name,
      Email: email,
      Phone: phone,
    });
    // ตรวจสอบว่าข้อมูลถูกเพิ่มเรียบร้อยหรือไม่ แล้วแสดง Alert ตามผลการเพิ่มข้อมูล
    if (adddata) {
      alert("Data Added Successfully");
      window.location.reload(); // reload หน้าใหม่
    } else {
      alert("Error Updata");
    }
  };

  // ## function ดึงข้อมูลมาแสดง
  const fetch = async () => {
    const snapshot = await getDocs(dbref); // ดึงข้อมูลจากคอลเล็กชัน "CRUD" ใน Firestore โดยใช้ getDocs
    const dataF = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // แปลงข้อมูลจาก snapshot เป็นรูปแบบที่ต้องการ (รวมถึง id ของเอกสาร)

    setFetchData(dataF);
    // console.log("fetchData:", fetchData);
  };
  useEffect(() => {
    fetch();
  }, []);

  // ## Updata data
  const passData = async (id) => {
    //มีการใช้ async เนื่องจากอาจมีการดำเนินการที่ต้องใช้เวลา (เช่น การค้นหาข้อมูล) ในฟังก์ชันนี้
    const matchId = fetchData.find((data) => {
      return data.id === id;
      //fetchData.find((data) => { return data.id === id })
      //คือการใช้เมธอด find() บนอาร์เรย์ fetchData เพื่อค้นหาข้อมูลที่มี id ตรงกับ id ที่ถูกส่งเข้ามาในพารามิเตอร์
    });
    //นำค่าที่ดึงมาจาก id ที่ตรงกับไป setState ให้แต่ละตัว เพื่อแสดงค่า ที่พร้อมจะแก้ไขและ Update ในภายหลัง
    setName(matchId.Name);
    setEmail(matchId.Email);
    setPhone(matchId.Phone);
    setId(matchId.id);
  };
  //update
  const updata = async () => {
    const updateref = doc(dbref, id);
    try {
      await updateDoc(updateref, { Name: name, Email: email, Phone: phone });
      alert("Update successfully");
      window.location.reload(); // reload หน้าใหม่
    } catch (error) {
      alert("updata Error", error);
    }
  };

  // ## Delete data
  const del = async (id) => {
    const delref = doc(dbref, id);
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
      <div className="form_container">
        <h2>Add / Updata Form</h2>
        <div className="box">
          <input
            type="text"
            placeholder="Full name"
            autoComplete="Off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="email"
            placeholder="Enail"
            autoComplete="Off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="text"
            placeholder="Phone Number"
            autoComplete="Off"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button onClick={add}>Add</button>
        <button onClick={updata}>Update</button>
      </div>
      <h2>CRUD Database</h2>
      <div className="content-data">
        {fetchData.map((data) => (
          <div className="box">
            <div className="text-data">
              <h2>
                Name: <span>{data.Name}</span>
              </h2>
              <h2>
                Email: <span>{data.Email}</span>
              </h2>
              <h2>
                Phone: <span>{data.Phone}</span>
              </h2>
              <button onClick={() => passData(data.id)}>update</button>
              <button onClick={() => del(data.id)}>delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
