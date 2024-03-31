import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageComponent from "./ImageComponent";
import { Attachment } from "./Attachment";

const PERSONAL_INFORMATION_PASSPORT = 1;
const PERSONAL_INFORMATION_NATIONAL_ID = 2;
const PERSONAL_INFORMATION_PERSONAL_PHOTO = 3;
const EDUCATION_CERTIFICATE = 4;
const EDUCATION_TRANSCRIPT = 5;
const EXPERIENCE_CERTIFICATE = 6;
const INTERNSHIP_CERTIFICATE = 7;
const LICENSE_LICENSE = 8;
const TRAINING_COURSE_CERTIFICATE = 9;

function App() {
  const authBody = { identifier: "feras1", password: "Feras_10203040" };

  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => console.log("user => ", user), [user]);
  useEffect(() => console.log("token => ", token), [token]);

  useEffect(() => {
    axios
      .post("/apis/auth/authenticate", authBody)
      .then((response) => {
        setToken(response.data.token);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .get("/apis/users", config)
        .then((response) => setUser(response.data))
        .catch((error) => console.error(error));
    }
  }, [token]);

  const _filterAttachments = (typeId) =>
    (user?.attachments || []).filter((attachment) => attachment.attachmentType == typeId);

  const _downloadAllAttachments = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };

    axios
      .get(`/apis/attachments/all-user-attachments/2`, config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", 'KARAM.zip');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error(error));

  }

  if (user && token) {
    return (
      <div className="App">
        <header className="App-header">
          <Attachment
            label="Personal Information Passport"
            attachments={_filterAttachments(PERSONAL_INFORMATION_PASSPORT)}
            token={token}
            typeId={PERSONAL_INFORMATION_PASSPORT}
          />

          <Attachment
            label="Personal Information National ID"
            attachments={_filterAttachments(PERSONAL_INFORMATION_NATIONAL_ID)}
            token={token}
            typeId={PERSONAL_INFORMATION_NATIONAL_ID}
          />

          <ImageComponent
            label="Personal Information Personal Photo"
            attachments={_filterAttachments(
              PERSONAL_INFORMATION_PERSONAL_PHOTO
            )}
            token={token}
            typeId={PERSONAL_INFORMATION_PERSONAL_PHOTO}
          />

          <Attachment
            label="Education Certificate"
            attachments={_filterAttachments(EDUCATION_CERTIFICATE)}
            token={token}
            typeId={EDUCATION_CERTIFICATE}
          />

          <Attachment
            label="Education Transcript"
            attachments={_filterAttachments(EDUCATION_TRANSCRIPT)}
            token={token}
            typeId={EDUCATION_TRANSCRIPT}
          />

          <Attachment
            label="Experience Transcript"
            attachments={_filterAttachments(EXPERIENCE_CERTIFICATE)}
            token={token}
            typeId={EXPERIENCE_CERTIFICATE}
          />

          <Attachment
            label="Internship Certificate"
            attachments={_filterAttachments(INTERNSHIP_CERTIFICATE)}
            token={token}
            typeId={EXPERIENCE_CERTIFICATE}
          />

          <Attachment
            label="License License"
            attachments={_filterAttachments(LICENSE_LICENSE)}
            token={token}
            typeId={LICENSE_LICENSE}
          />

          <Attachment
            label="Training Course Certificate"
            attachments={_filterAttachments(TRAINING_COURSE_CERTIFICATE)}
            token={token}
            typeId={TRAINING_COURSE_CERTIFICATE}
          />

          <button onClick={_downloadAllAttachments}>Download All Attachments</button>
        </header>
      </div>
    );
  }

  return <></>;
}

export default App;
