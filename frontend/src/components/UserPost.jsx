import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Flex,
  Text,
  Image,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

const UserPost = ({ likes, postImg, replies, title }) => {
  const [liked, setLiked] = useState(false);
  const toast = useToast();
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        // console.log("url copied");
        toast({
          description: "Post link copied",
          duration: 3000,
          isClosable: true,
          status: "success",
        });
      })
      .catch(() => {});
  };

  return (
    <Link to={`/markzukerberg/post/234`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name="markzuckerberg"
            src="/zuck-avatar.png"
          ></Avatar>
          <Box w="1px" h="full" bg="gray.light" my="2"></Box>
          <Box position={"relative"} w="full">
            <Avatar
              size={"xs"}
              name="john doe"
              position={"absolute"}
              src="https://bit.ly/dan-abramov"
              top="0px"
              left="15px"
              padding="2px"
            />
            <Avatar
              size={"xs"}
              name="john doe"
              position={"absolute"}
              src="https://bit.ly/dan-abramov"
              bottom="0px"
              right="-5px"
              padding="2px"
            />
            <Avatar
              size={"xs"}
              name="john doe"
              position={"absolute"}
              src="https://bit.ly/dan-abramov"
              bottom="0px"
              left="4px"
              padding="2px"
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap="2">
          <Flex justifyContent={"space-between"} w="full">
            <Flex alignItems={"space-between"} w="full">
              <Text fontSize={"sm"} fontWeight={"bold"}>
                Mark Zuckerberg
              </Text>
              <Image src="/verified.png" w="4" h="4" ml="1" />
            </Flex>
            <Flex
              gap="4"
              alignItems={"center"}
              onClick={(e) => e.preventDefault()}
            >
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <Portal>
                  <MenuList bg="gray.dark" color={"gray.light"}>
                    <MenuItem
                      bg="gray.dark"
                      color={"gray.light"}
                      onClick={copyURL}
                    >
                      Copy Link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{title}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={postImg} w="full" />
            </Box>
          )}
          <Flex gap="3" my="1">
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color="gray.light" fontSize={"small"}>
              {replies} replies
            </Text>
            <Box w="0.5" h="0.5" borderRadius={"full"} bg="gray.light"></Box>
            <Text color="gray.light" fontSize={"small"}>
              {likes} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};
export default UserPost;
