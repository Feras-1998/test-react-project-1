import axios from "axios";
import { useState } from "react";

export const Attachment = (props) => {
  const { label, attachments, token, typeId } = props;

  const [file, setFile] = useState(null);

  const _handleClick = () => {
    const multipartConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`/apis/attachments/${typeId}`, formData, multipartConfig)
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  const _handleDownloadAction = (attachment) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };

    axios
      .get(`/apis/attachments/${attachment.id}`, config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", 'KARAM.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error(error));
  };

  const _handleDeleteAction = (attachment) => {
    const config = {headers: { Authorization: `Bearer ${token}` }};
    axios
      .delete(`/apis/attachments/${attachment.id}`, config)
      .then(() => console.log("Deleted"))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <h3>{label}</h3>
      <div>
        <button onClick={_handleClick}>Save</button>
        <input
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
        />

        {attachments.map((attachment) => (
          <div key={attachment.id}>
            <label>{attachment.originalFileName}</label>
            <button onClick={() => _handleDownloadAction(attachment)}>
              Download
            </button>
            <button onClick={() => _handleDeleteAction(attachment)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <h3>{label}</h3>
    </>
  );
};
