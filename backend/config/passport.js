// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import User from "../models/User.js";

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/auth/google/callback",
//     },

//     async (accessToken, refreshToken, profile, done) => {

//       try {

//         const email = profile.emails[0].value;

//         // ✅ check using email, NOT googleId
//         let user = await User.findOne({ email });

//         if (!user) {

//           // create new user
//           user = await User.create({

//             googleId: profile.id,

//             name: profile.displayName || profile.name?.givenName || "User",

//             email: email,

//             isVerified: false

//           });

//           console.log("✅ New user created");
//           console.log("GOOGLE PROFILE NAME:", profile.displayName);
//         }
//         else {

//           // update googleId if missing
//           if (!user.googleId) {

//             user.googleId = profile.id;

//             await user.save();

//           }

//           console.log("✅ Existing user logged in");

//         }

//         return done(null, user);

//       }
//       catch (error) {

//         console.log(error);

//         return done(error, null);

//       }

//     }
//   )
// );


// // serialize
// passport.serializeUser((user, done) => {

//   done(null, user._id);

// });


// // deserialize
// passport.deserializeUser(async (id, done) => {

//   try {

//     const user = await User.findById(id);

//     done(null, user);

//   }
//   catch (error) {

//     done(error, null);

//   }

// });


// export default passport;



import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Get email
        const email = profile.emails?.[0]?.value;

        // ✅ SAFELY get name
        const name =
          profile.displayName ||
          `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim() ||
          "User";

        console.log("🔍 Google Profile:", profile);
        console.log("✅ Final Name:", name);

        // ✅ Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
          // 🔥 Create new user
          user = await User.create({
            googleId: profile.id,
            name: name,
            email: email,
            isVerified: false
          });

          console.log("✅ New user created");
        } else {
  // 🔥 Update googleId if missing
  if (!user.googleId) {
    user.googleId = profile.id;
  }

  // 🔥 Update name if missing
  if (!user.name || user.name === "User") {
    user.name = name;
  }

  // 🔥 FORCE OTP FLOW (IMPORTANT FIX)
  user.isVerified = false;

  await user.save();

  console.log("✅ Existing user → OTP required");
}
        return done(null, user);

      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

// serialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// deserialize
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;