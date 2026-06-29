
// // import mongoose from "mongoose";

// // const userSchema = new mongoose.Schema({

// //   // ================= BASIC INFO =================
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     lowercase: true,
// //     trim: true
// //   },

// //   firstName: { type: String, default: null },
// //   lastName: { type: String, default: null },
// //   fullName: { type: String, default: null },
// //   dob: { type: String, default: null },

// //   password: { type: String, default: null },

// //   // ================= GOOGLE LOGIN =================
// //   googleId: { type: String, default: null },

// //   // ================= OTP =================
// //   otp: { type: String, default: null },
// //   otpExpiry: { type: Number, default: null },
// //   isVerified: { type: Boolean, default: false },

// //   // ================= PIN =================
// //   pin: { type: String, default: null },

// //   // ================= KYC (STRUCTURED) =================
// //   kyc: {

// //     panNumber: {
// //       type: String,
// //       default: null
// //     },

// //     aadhaarNumber: {
// //       type: String,
// //       default: null
// //     },

// //     aadhaarImage: {
// //       type: String,
// //       default: null
// //     },

// //     panImage: {
// //       type: String,
// //       default: null
// //     },

// //     selfieImage: {
// //       type: String,
// //       default: null
// //     },

// //     faceVerified: {
// //       type: Boolean,
// //       default: false
// //     },

// //     status: {
// //       type: String,
// //       enum: ["NOT_STARTED", "PENDING", "APPROVED", "REJECTED"],
// //       default: "NOT_STARTED"
// //     },

// //     submittedAt: {
// //       type: Date,
// //       default: null
// //     },

// //     verifiedAt: {
// //       type: Date,
// //       default: null
// //     }

// //   },

// //   // ================= QUICK FLAG =================
// //   kycCompleted: {
// //     type: Boolean,
// //     default: false
// //   },

// //   // ================= PAPER TRADING =================
// //   balance: {
// //     type: Number,
// //     default: 100000
// //   },

// //   // ================= SYSTEM =================
// //   createdAt: {
// //     type: Date,
// //     default: Date.now
// //   }

// // });

// // const User = mongoose.model("User", userSchema);

// // export default User;



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({

//   // ================= BASIC INFO =================
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },

//   firstName: {
//     type: String,
//     default: null
//   },

//   lastName: {
//     type: String,
//     default: null
//   },

//   fullName: {
//     type: String,
//     default: null
//   },

//   dob: {
//     type: String,
//     default: null
//   },

//   password: {
//     type: String,
//     default: null
//   },

//   // ================= GOOGLE LOGIN =================
//   googleId: {
//     type: String,
//     default: null
//   },

//   // ================= OTP =================
//   otp: {
//     type: String,
//     default: null
//   },

//   otpExpiry: {
//     type: Number,
//     default: null
//   },

//   isVerified: {
//     type: Boolean,
//     default: false
//   },

//   // ================= PIN =================
//   pin: {
//     type: String,
//     default: null
//   },

//   // ================= KYC =================
//   kyc: {
//     panNumber: {
//       type: String,
//       default: null
//     },

//     aadhaarNumber: {
//       type: String,
//       default: null
//     },

//     aadhaarImage: {
//       type: String,
//       default: null
//     },

//     panImage: {
//       type: String,
//       default: null
//     },

//     selfieImage: {
//       type: String,
//       default: null
//     },

//     status: {
//       type: String,
//       default: "NOT_STARTED"
//     },

//     submittedAt: {
//       type: Date,
//       default: null
//     },

//     verifiedAt: {
//       type: Date,
//       default: null
//     }
//   },

//   // ================= KYC FLAG =================
//   kycCompleted: {
//     type: Boolean,
//     default: false
//   },

//   // ================= PAPER TRADING =================
//   balance: {
//     type: Number,
//     default: 100000
//   },

//   // ================= SYSTEM =================
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// });

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  // ================= BASIC INFO =================
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  firstName: {
    type: String,
    default: null
  },

  lastName: {
    type: String,
    default: null
  },

  fullName: {
    type: String,
    default: null
  },

  dob: {
    type: String,
    default: null
  },

  password: {
    type: String,
    default: null
  },

  // ================= GOOGLE LOGIN =================
  googleId: {
    type: String,
    default: null
  },

  // ================= OTP =================
  otp: {
    type: String,
    default: null
  },

  otpExpiry: {
    type: Number,
    default: null
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // ================= PIN =================
  pin: {
    type: String,
    default: null
  },

  // ================= KYC =================
  kyc: {
    panNumber: { type: String, default: null },
    aadhaarNumber: { type: String, default: null },
    aadhaarImage: { type: String, default: null },
    panImage: { type: String, default: null },
    selfieImage: { type: String, default: null },

    status: {
      type: String,
      default: "NOT_STARTED" // NOT_STARTED | PENDING | VERIFIED | REJECTED
    },

    submittedAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null }
  },

  // ================= KYC FLAG =================
  kycCompleted: {
    type: Boolean,
    default: false
  },

  // ================= 💰 WALLET =================
  wallet: {
  balance: {
    type: Number,
    default: 0   // 🔥 NO FAKE MONEY
  },
  invested: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  }
},

  // ================= 📊 PORTFOLIO =================
  portfolio: [
    {
      symbol: String,        // BTCUSDT
      amount: Number,        // ₹ invested
      quantity: Number,      // actual coins
      entryPrice: Number,
      currentPrice: {
        type: Number,
        default: 0
      },
      pnl: {
        type: Number,
        default: 0
      }
    }
  ],

  // ================= 📜 TRADE HISTORY =================
  history: [
    {
      symbol: String,
      type: String, // BUY / SELL
      amount: Number,
      price: Number,
      pnl: {
        type: Number,
        default: 0
      },
      time: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // ================= 🤖 AI STATS =================
  aiStats: {
    totalTrades: {
      type: Number,
      default: 0
    },
    winTrades: {
      type: Number,
      default: 0
    },
    lossTrades: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    }
  },

  // ================= SYSTEM =================
  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("User", userSchema);