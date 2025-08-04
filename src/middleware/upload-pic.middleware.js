import multer from "multer" // lib สำหรับ จัดการไฟล์ที่ส่งเข้ามา pdf รูป
import path from "path"


const dest = path.join(process.cwd() , "temp-pic")
const storage = multer.diskStorage({// config option multer 
    destination :(req , file ,cb)=> cb(null , dest), // null = ถ้าไม่มี error dest คือตำแหน่งที่จะวาง
    filename : (req , file , cb)=>{
        let fileExt = path.extname(file.originalname) //หา ext ไฟล์มาปะ file.originalname คือเอาชื่อไฟล์มา
        let filename = `Pic_${Date.now()}_${Math.round(Math.random()*100)}${fileExt}` //ใช้วัน + random เพื่อให้ไฟล์มันชื่อไม่ซ้ำกัน
        cb(null , filename)
    }

})

export default multer({storage})

