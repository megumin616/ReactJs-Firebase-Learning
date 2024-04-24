import { useEffect, useState } from "react";
import "./App.css";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// ** comment อธิบายที่จะ ของโค้ดบรรทัดไหน จะอธิบายลงล่าง

function App() {
  const [imageUpload, setImageUpload] = useState(null); // สร้าง state เพื่อเก็บข้อมูลไฟล์รูปภาพที่เลือก
  const [imageList, setImageList] = useState([]); //สร้าง state เพื่อเก็บรูปภาพทั้งหมดที่ดึงมา

  const imageListRef = ref(storage, "images/"); // สร้าง path ว่าจะให้ไปที่ไฟล์ไหน ใน Storage in firebase

  // ฟังก์ชันสำหรับการอัปโหลดรูปภาพ
  const uploadImage = () => {
    if (imageUpload == null) return; // ถ้าไม่มีไฟล์ที่เลือก จบการทำงาน
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`); // สร้าง reference สำหรับเก็บไฟล์ใน Firebase Storage และเพิ่ม UUID เพื่อไม่ให้ซ้ำกัน
    //และ ref เป้นเหมือนการกำหนดเส้นทางว่าจะให้ไฟล์ไปเก็บอยู่ที่ไหน  ในที่นี้ใช้เป็น
    //images/ -> โฟเดอร์, ${imageUpload.name + v4}  -> ชื่อไฟล?รูปภาพ และบวกด้วย id ที่ไใ่ซ้ำกัน
    uploadBytes(imageRef, imageUpload).then((snaphsot) => {
      // อัปโหลดไฟล์ไปยัง Storage
      //uploadBytes เป็รฟังชั่นอัพโหลด โดยที่ไฟล์ที่จะอัปโหลดเป็นพารามิเตอร์ uploadBytes(ref, file)
      //ref: เป็น reference ที่เรากำหนดไว้เพื่อระบุตำแหน่งที่ไฟล์จะถูกอัปโหลดลงใน Firebase Storage
      //file: เป็นข้อมูลของไฟล์ที่จะอัปโหลด เช่น ไฟล์รูปภาพ ไฟล์เอกสาร เป็นต้น
      //alert("Image Uploaded"); // แสดงแจ้งเตือนเมื่อการอัปโหลดเสร็จสิ้น
      getDownloadURL(snaphsot.ref).then((url) => {
        setImageList((prev) => [...prev, url])
      })
    });
  };

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      // console.log(response)
      //listAll ใช้ในการเรียกดูรายการของไฟล์ทั้งหมดที่อยู่ในตำแหน่งที่ระบุโดยตัวแปร imageListRef เป็นตำแหน่งที่ได้ระบุไว้
      response.items.forEach((item) => {
        // วนลูปผ่านทุกไฟล์ที่อยู่ในตำแหน่งที่ระบุ และ .itmes เป็นการเข้าถึงข้อมูล (console response ดูได้)
        getDownloadURL(item).then((url) => {
          // รับ URL สำหรับการดาวน์โหลดไฟล์จาก Firebase Storage
          setImageList((prev) => [...prev, url]); // เพิ่ม URL ลงใน state imageList  [...prev, url]  เป็นการเก้บค่าเดิมไว้และตามด้วยแสดงค่าใหม่
          //console.log(url) //ที่ต้องใช้ getDownloadURL เพราะจะดึงเอาแค่ url ของรูปภาพมาแสดง
          //เพื่อที่ไม่ต้อง download มาเก็บไว้ในเครื่อง เพื่อแสดงข้อมูล (ประหยัดเวลามาก)
        });
      });
    });
  }, []);

  return (
    <div className="app">
      <input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>

      {imageList.map((url) => {
        return <img src={url} width={200} />;
      })}
    </div>
  );
}

export default App;
