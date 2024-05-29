import React, { useState } from "react";
import Navbar from "../components/Navbar";

// firebase
import { db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Form() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageData, setImageData] = useState([]);

  // const imagePathRef = ref(storage, "images/");

  console.log("Data", db);

  // const auth = getAuth();
  // const user = auth.currentUser;

  const handleAddData = async (event,id) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าจอ *สำคัญ เพื่อให้ข้อมูลส่งไปก่อนที่จะ refresh

    try {
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef); //Get URL Image
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        age: age,
        imageUrl: downloadURL, // เพิ่ม URL ของภาพลงใน Firestore
      });
      console.log("Document success", docRef.id);
    } catch (e) {
      console.error("Error", e);
    }
  };
  return (
    <>
      <Navbar />
      <form>
        <legend>Add Data</legend>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name..."
            // value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="text"
            className="form-control"
            placeholder="Age..."
            // value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            placeholder="File..."
            // value={age}
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleAddData}
        >
          Submit
        </button>
      </form>
    </>
  );
}
