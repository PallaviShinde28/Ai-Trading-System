
// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import User from "../models/User.js";

// const router = express.Router();

// // ================= ENSURE UPLOADS FOLDER =================
// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }

// // ================= STORAGE CONFIG =================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const fileName = Date.now() + "-" + file.originalname;
//     cb(null, fileName);
//   }
// });

// const upload = multer({ storage });

// // ================= KYC UPLOAD API =================
// router.post(
//   "/upload",
//   upload.fields([
//     { name: "aadhaarImage", maxCount: 1 },
//     { name: "panImage", maxCount: 1 },
//     { name: "selfieImage", maxCount: 1 }
//   ]),
//   async (req, res) => {

//     try {

//       console.log("BODY:", req.body);
//       console.log("FILES:", req.files);

//       const {
//         email,
//         fullName,
//         dob,
//         panNumber,
//         aadhaarNumber
//       } = req.body;

//       if (!email) {
//         return res.status(400).json({
//           success: false,
//           message: "Email required"
//         });
//       }

//       // ================= FILES =================
//       const aadhaarPath =
//         req.files?.aadhaarImage?.[0]?.path || null;

//       const panPath =
//         req.files?.panImage?.[0]?.path || null;

//       const selfiePath =
//         req.files?.selfieImage?.[0]?.path || null;

//       if (!aadhaarPath || !panPath) {
//         return res.status(400).json({
//           success: false,
//           message: "Aadhaar and PAN required"
//         });
//       }

//       // ================= FIND USER =================
//       const user = await User.findOne({ email });

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found"
//         });
//       }

//       // 🔥🔥🔥 THIS IS YOUR REQUIRED CODE (CORRECT PLACE)
//       user.fullName = fullName;
//       user.dob = dob;

//       user.kyc = {
//   panNumber,
//   aadhaarNumber,
//   aadhaarImage,
//   panImage,
//   selfieImage,
//   status: "APPROVED",        // ✅ DIRECT APPROVAL
//   submittedAt: new Date(),
//   verifiedAt: new Date()     // ✅ AUTO VERIFIED
// };

// user.kycCompleted = true;    // ✅ ALLOW DASHBOARD

//       await user.save();

//       res.json({
//         success: true,
//         message: "KYC submitted successfully",
//         user
//       });

//     } catch (err) {

//       console.log("KYC ERROR:", err);

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });

//     }

//   }
// );

// // ================= KYC STATUS =================
// router.get("/status/:email", async (req, res) => {

//   try {

//     const user = await User.findOne({
//       email: req.params.email
//     });

//     res.json({
//       kycCompleted: user?.kycCompleted || false,
//       status: user?.kyc?.status || "NOT_STARTED"
//     });

//   } catch {

//     res.json({
//       kycCompleted: false,
//       status: "NOT_STARTED"
//     });

//   }

// });

// export default router;




import express from "express";
import multer from "multer";
import fs from "fs";
import User from "../models/User.js";

const router = express.Router();

// ================= ENSURE UPLOADS FOLDER =================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ================= STORAGE CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// ================= KYC UPLOAD API =================
router.post(
  "/upload",
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 }
  ]),
  async (req, res) => {

    try {

      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      const {
        email,
        fullName,
        dob,
        panNumber,
        aadhaarNumber
      } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email required"
        });
      }

      // ================= FILES =================
      const aadhaarPath =
        req.files?.aadhaarImage?.[0]?.path || null;

      const panPath =
        req.files?.panImage?.[0]?.path || null;

      const selfiePath =
        req.files?.selfieImage?.[0]?.path || null;

      if (!aadhaarPath || !panPath) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar and PAN required"
        });
      }

      // ================= FIND USER =================
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // ================= SAVE KYC =================
      user.fullName = fullName;
      user.dob = dob;

      // 🔥 FIXED VARIABLES HERE
      user.kyc = {
        panNumber,
        aadhaarNumber,
        aadhaarImage: aadhaarPath,
        panImage: panPath,
        selfieImage: selfiePath,
        status: "APPROVED",        // auto approve
        submittedAt: new Date(),
        verifiedAt: new Date()
      };

      user.kycCompleted = true;

      await user.save();

      res.json({
        success: true,
        message: "KYC submitted successfully",
        user
      });

    } catch (err) {

      console.log("KYC ERROR:", err);

      res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);

// ================= KYC STATUS =================
router.get("/status/:email", async (req, res) => {

  try {

    const user = await User.findOne({
      email: req.params.email
    });

    res.json({
      success: true,
      kycCompleted: user?.kycCompleted || false,
      status: user?.kyc?.status || "NOT_STARTED"
    });

  } catch {

    res.json({
      success: false,
      kycCompleted: false,
      status: "NOT_STARTED"
    });

  }

});

export default router;