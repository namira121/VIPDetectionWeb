import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: "uploads/payments",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `payment-${Date.now()}${ext}`)
  },
})

export const uploadPaymentProof = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("proof")
