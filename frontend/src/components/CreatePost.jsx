import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atoms";
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("post");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [loading, setLoading] = useState(false);
  const { handleImageChange, imageUrl, setImageUrl } = useImagePreview();
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  //console.log(user);
  const imageRef = useRef(null);
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Created Successfully", "success");
      onClose();
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                value={postText}
                onChange={handleTextChange}
                placeholder="Post content goes here..."
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m="1"
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                ref={imageRef}
                hidden
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imageUrl && (
              <Flex mt={5} w="full" position={"relative"}>
                <Image src={imageUrl} alt="selected Img" />
                <CloseButton
                  onClick={() => setImageUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreatePost;
