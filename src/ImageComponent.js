import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageComponent = (props) => {
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
          <Image key={attachment.id} token={token} attachment={attachment} />
        ))}
      </div>
      <h3>{label}</h3>
    </>
  );
};

const Image = (props) => {
  const { token, attachment } = props;

  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "image/png",
          },
          responseType: "blob",
        };

        const response = await axios.get(
          `/apis/attachments/${attachment.id}`,
          config
        );
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, []);

  const _handleDownloadAction = () => {
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
        link.setAttribute("download", attachment.originalFileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error(error));
  };

  const _handleDeleteAction = () => {
    const config = {headers: { Authorization: `Bearer ${token}` }};
    axios
      .delete(`/apis/attachments/${attachment.id}`, config)
      .then(() => console.log("Deleted"))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <img src={imageSrc} alt="Image" />
      <button onClick={() => _handleDownloadAction()}>Download</button>
      <button onClick={() => _handleDeleteAction()}>Delete</button>
    </>
  );
};

export default ImageComponent;
