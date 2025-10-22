const ImageUpload = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_api_key_imageBB
    }`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  return data;
};

export default ImageUpload;
