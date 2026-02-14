import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: "uploads/vips",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `vip-${Date.now()}${ext}`)
  },
})

export const uploadVipPhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"))
    } else {
      cb(null, true)
    }
  },
}).single("photo")
