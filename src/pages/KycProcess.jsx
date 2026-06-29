
import React,{useState,useRef,useEffect} from "react";
import axios from "axios";
import "./KycProcess.css";

export default function KycProcess(){

const email =
new URLSearchParams(window.location.search).get("email") ||
localStorage.getItem("email");

const [step,setStep]=useState(1);

const [fullName,setFullName]=useState("");
const [dob,setDob]=useState("");
const [pan,setPan]=useState("");

const [aadhaar,setAadhaar]=useState(null);
const [panImg,setPanImg]=useState(null);

const [selfie,setSelfie]=useState(null);
const [preview,setPreview]=useState(null);

const [loading,setLoading]=useState(false);
const [success,setSuccess]=useState(false);

////////////////////////////////////////////////
// VALIDATION
////////////////////////////////////////////////

const next1=()=>{
if(!fullName||!dob){
alert("Fill all fields");
return;
}
setStep(2);
};

const next2=()=>{
if(!pan||!aadhaar||!panImg){
alert("Upload all documents");
return;
}
setStep(3);
};

////////////////////////////////////////////////
// SUBMIT
////////////////////////////////////////////////

const submit=async()=>{

if(!email){
alert("Session expired. Please login again.");
return;
}

try{

setLoading(true);

const form=new FormData();

form.append("email",email);
form.append("fullName",fullName);
form.append("dob",dob);
form.append("panNumber",pan);

form.append("aadhaarImage",aadhaar);
form.append("panImage",panImg);

if(selfie){
form.append("selfieImage",selfie);
}

const res = await axios.post(
"http://localhost:5000/api/kyc/upload",
form
);

if(res.data.success){

setSuccess(true);

// 🔥 FINAL REDIRECT
setTimeout(()=>{
window.location.href="/dashboard";
},1500);

}else{
alert("KYC failed");
}

}
catch(err){
console.log("KYC ERROR:",err);
alert("Upload failed");
}
finally{
setLoading(false);
}

};

////////////////////////////////////////////////
// UI
////////////////////////////////////////////////

return(

<div className="kyc-container">

<Sidebar step={step}/>

<div className="kyc-main">

<h1 className="verify-title">
Verify Identity
</h1>

<Progress step={step}/>

<div className="kyc-card">

{/* STEP 1 */}
{step===1&&(
<>
<h2>Personal Info</h2>

<input
className="input"
placeholder="Full Name"
value={fullName}
onChange={e=>setFullName(e.target.value)}
/>

<input
type="date"
className="input"
value={dob}
onChange={e=>setDob(e.target.value)}
/>

<button
className="primary-btn"
onClick={next1}>
Continue
</button>
</>
)}

{/* STEP 2 */}
{step===2&&(
<>
<h2>Upload Documents</h2>

<input
className="input"
placeholder="PAN Number"
value={pan}
onChange={e=>setPan(e.target.value)}
/>

<div className="upload-grid">

<FileCard title="Aadhaar Card" file={aadhaar} setFile={setAadhaar}/>
<FileCard title="PAN Card" file={panImg} setFile={setPanImg}/>

</div>

<ButtonRow back={()=>setStep(1)} next={next2}/>
</>
)}

{/* STEP 3 */}
{step===3&&(
<>
<h2>Face Verification</h2>

<FaceCapture
setSelfie={setSelfie}
preview={preview}
setPreview={setPreview}
/>

<ButtonRow back={()=>setStep(2)} next={()=>setStep(4)}/>
</>
)}

{/* STEP 4 */}
{step===4&&(
<>
<h2 className="review-title">Review Details</h2>

<div className="review-container">

<div className="review-left">
<ReviewRow label="Full Name" value={fullName}/>
<ReviewRow label="DOB" value={dob}/>
<ReviewRow label="PAN" value={pan}/>
</div>

<div className="review-right">
<ImageCard label="Aadhaar" file={aadhaar}/>
<ImageCard label="PAN" file={panImg}/>
{preview && <ImageCard label="Selfie" preview={preview}/>}
</div>

</div>

<ButtonRow
back={()=>setStep(3)}
next={submit}
nextText={loading?"Submitting...":"Submit"}
/>

</>
)}

</div>

{success && <Success/>}

</div>
</div>
);
}

////////////////////////////////////////////////
// COMPONENTS (UNCHANGED)
////////////////////////////////////////////////

function Sidebar({step}){
const steps=["Personal","Documents","Face","Review"];
return(
<div className="sidebar">
<h3>Verify Identity</h3>
{steps.map((s,i)=>(
<div key={i}
className={step>=i+1?"sidebar-item active":"sidebar-item"}>
{s}
</div>
))}
</div>
);
}

function Progress({step}){
return(
<div className="progress">
<div className="progress-fill"
style={{width:(step/4)*100+"%"}}/>
</div>
);
}

function FileCard({title,file,setFile}){
return(
<div className="file-card">
<div>{title}</div>
<label className="upload-box">
<input type="file" hidden
onChange={e=>setFile(e.target.files[0])}/>
<div>{file?"✓ Uploaded":"Click Upload"}</div>
</label>
</div>
);
}

function FaceCapture({setSelfie,preview,setPreview}){

const videoRef=useRef();
const canvasRef=useRef();
const [camera,setCamera]=useState(false);

useEffect(()=>{
if(camera){
navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
videoRef.current.srcObject=stream;
});
}
},[camera]);

const capture=()=>{
const canvas=canvasRef.current;
const video=videoRef.current;

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

canvas.getContext("2d").drawImage(video,0,0);

canvas.toBlob(blob=>{
setSelfie(blob);
setPreview(URL.createObjectURL(blob));
});
};

return(
<div className="face-box">

{preview ? (
<img src={preview} className="face-preview"/>
) : camera ? (
<video ref={videoRef} autoPlay/>
) : (
<div className="face-placeholder">Camera Off</div>
)}

<canvas ref={canvasRef} hidden/>

<div className="face-buttons">
<button onClick={()=>setCamera(true)}>Start Camera</button>
<button onClick={capture}>Capture</button>

<label>
Upload
<input type="file" hidden accept="image/*"
onChange={e=>{
setSelfie(e.target.files[0]);
setPreview(URL.createObjectURL(e.target.files[0]));
}}/>
</label>
</div>

</div>
);
}

function ButtonRow({back,next,nextText="Next"}){
return(
<div className="btn-row">
<button onClick={back}>Back</button>
<button onClick={next}>{nextText}</button>
</div>
);
}

function ReviewRow({label,value}){
return(
<div className="review-row">
<div className="review-label">{label}</div>
<div className="review-value">{value}</div>
</div>
);
}

function ImageCard({label,file,preview}){
const src = preview || URL.createObjectURL(file);
return(
<div className="review-image-card">
<div className="image-title">{label}</div>
<img src={src} className="review-image"/>
</div>
);
}

function Success(){
return(
<div className="success">
KYC Completed ✓
</div>
);
}