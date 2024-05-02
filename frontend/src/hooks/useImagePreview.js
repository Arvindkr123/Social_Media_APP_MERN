import { useState } from "react";
import useShowToast from "./useShowToast";

const useImagePreview = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    //console.log(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      console.log(reader);
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Error", "Invalid file type", "error");
      setImageUrl(null);
    }
  };
  return { imageUrl, handleImageChange };
};
export default useImagePreview;
