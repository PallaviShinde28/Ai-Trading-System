import express from "express";
import axios from "axios";
import User from "../models/User.js";

const router = express.Router();

router.get("/callback", async (req, res) => {

  try {

    const code = req.query.code;

    if (!code) {

      return res.send("Authorization failed");

    }

    // Exchange code for token
    const tokenResponse =
      await axios.post(
        "https://digilocker.meripehchaan.gov.in/public/oauth2/token",
        new URLSearchParams({

          grant_type: "authorization_code",

          code: code,

          client_id: process.env.DIGILOCKER_CLIENT_ID,

          client_secret: process.env.DIGILOCKER_CLIENT_SECRET,

          redirect_uri:
          "http://localhost:5000/api/digilocker/callback"

        }),
        {
          headers: {
            "Content-Type":
            "application/x-www-form-urlencoded"
          }
        }
      );

    const accessToken =
      tokenResponse.data.access_token;

    // Fetch user profile
    const profile =
      await axios.get(
        "https://digilocker.meripehchaan.gov.in/public/oauth2/1/user/profile",
        {
          headers: {
            Authorization:
            `Bearer ${accessToken}`
          }
        }
      );

    const email =
      profile.data.email ||
      "user@gmail.com";

    const name =
      profile.data.name;

    const dob =
      profile.data.dob;

    // Save in MongoDB
    await User.updateOne(
      { email: email },
      {
        fullName: name,
        dob: dob,
        kycCompleted: true
      },
      { upsert: true }
    );

    // Redirect back
    res.redirect(
      `http://localhost:5173/dashboard?email=${email}`
    );

  }
  catch (err) {

    console.log(err);

    res.send("DigiLocker KYC failed");

  }

});

export default router;
