import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  name: "",
  age: "",
  img: "",
};
export default function AddData() {
  const [data, setData] = useState(initialState);  //ต้องการเก็บข้อมูลอะไร ก็กำหนดใน initialState
  const { name, age } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  //Upload file ที่ใช้ useEffect เพราะเมื่อมีการเลือกไฟล์ใน <input> แล้ว จะทำการอัพโหลด (firebaase) ทันที
  useEffect(() => {
    const uploadFile = () => {
      // เมื่อมีการเปลี่ยนแปลงใน `file` (ไฟล์ที่ผู้ใช้เลือก), `useEffect()` จะถูกเรียกใช้.
      const name = new Date().getTime() + file.name;
      // สร้าง reference ไปยังโฟลเดอร์ใน Firebase Storage โดยใช้ชื่อไฟล์
      const storageRef = ref(storage, file.name);
      // เริ่มกระบวนการอัปโหลดไฟล์ด้วย `uploadBytesResumable()`
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        // ติดตามสถานะการอัปโหลดของไฟล์ด้วย `uploadTask.on()` โดยรายงานความคืบหน้าและสถานะของการอัปโหลดในแต่ละขั้นตอน
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //ส่วนนี้คำนวณความคืบหน้าของการอัปโหลดในรูปแบบของเปอร์เซ็นต์
          setProgress(progress); //อัปเดตค่าความคืบหน้า เพื่อทำให้ UI แสดงความคืบหน้าที่ถูกต้อง.
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        // เมื่อการอัปโหลดเสร็จสมบูรณ์ `() => {...}` จะถูกเรียก เพื่อดึง URL ของไฟล์ที่อัปโหลดเสร็จสมบูรณ์ด้วย
        //`getDownloadURL()` และเพิ่ม URL นี้ในข้อมูล `data` โดยใช้ `setData()`
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    // ถ้ามีไฟล์ที่เลือกอยู่ ให้เริ่มกระบวนการอัปโหลด
    file && uploadFile();
  }, [file]);

  //รับค่าจาก <input>
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    //เป็นการสร้างออบเจ็กต์ใหม่ของข้อมูลโดยนำข้อมูลเดิมมา และแทนที่ค่าของฟิลด์ที่เปลี่ยนแปลงด้วยค่าใหม่ที่ผู้ใช้ป้อนเข้ามา
  };

  //สร้าง Function สำหรับการตรวจสอบว่าได้ใส่ข้อมูลตามที่ต้องการรึเปล่า ในที่นี้คือ ห้ามมีค่าว่าง
  const validata = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is Required";
    }
    if (!age) {
      errors.age = "Age is Required";
    }

    return errors;
  };

  //Function อัพข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault(); //กันการ Refresh จำเป็น
    let errors = validata();
    if (Object.keys(errors).length) { // ถ้ามีข้อผิดพลาด
      return setErrors(errors); // ตั้งค่า errors ใน state และหยุดการทำงานของฟังก์ชัน
    } else {
      setErrors({}); // เคลียร์ errors ใน state
      setIsSubmit(true); // ตั้งค่า isSubmit เป็น true เพื่อแสดงว่าข้อมูลกำลังถูกส่ง
      if (!id) { // ถ้าไม่มี id (เพิ่มข้อมูลใหม่)
        try {
          await addDoc(collection(db, "users"), {
            ...data,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.log(error);
        }
      } else { // ถ้ามี id (อัปเดตข้อมูล)
        try {
            await updateDoc(doc(db, "users", id), {
              ...data,
              timestamp: serverTimestamp(),
            });
          } catch (error) {
            console.log(error);
          }
      }
      navigate("/");
    }
  };

  return (
    <>
      <div>
        <h1>{id ? "Update Data" : "Add Data"}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={name}
            autoFocus
            onChange={handleChange}
            placeholder={errors.name ? errors.name : "Name..."}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="text"
            className="form-control"
            name="age"
            value={age}
            autoFocus
            onChange={handleChange}
            placeholder={errors.age ? errors.age : "Age..."}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={progress !== null && progress < 100}
          //ในกรณีที่ค่าของตัวแปร progress ไม่ใช่ null และค่าของ progress น้อยกว่า 100% ในการอัปโหลดไฟล์.
          //เพราะว่า หากไฟล์กำลังอยู่ในขั้นตอนกำลังส่งไฟล์ จะไม่สามารถกดปุ่มได้ กันการเกิดข้อผืดพลาด * สำคัญ
        >
          Submit
        </button>
      </form>
    </>
  );
}
