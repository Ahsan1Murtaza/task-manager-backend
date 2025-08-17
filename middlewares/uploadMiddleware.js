import multer from 'multer'

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(new Error('Only .jpg, .jpeg, .png formats are allowed'))
    }
}

const upload = multer({storage, fileFilter})

export default upload