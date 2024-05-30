import { Link, useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atoms";

const Post = ({ post, userId }) => {
  // console.log(post, userId);
  const currentUser = useRecoilValue(userAtom);
  //console.log(currentUser);
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + userId);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
        // console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getUser();
  }, [userId, showToast]);
  //console.log(post);
  //console.log(user);

  if (!user) {
    return null;
  }
  //console.log(post?.replies[0]?.userProfilePic);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete")) {
      return;
    }
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      //console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post has been deleted successfully!", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Link to={`/${user?.username}/post/${post?._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user?.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user?.username}`);
            }}
          ></Avatar>
          <Box w="1px" h="full" bg="gray.light" my="2"></Box>
          <Box position={"relative"} w="full">
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post?.replies[0] && (
              <Avatar
                size={"xs"}
                name="john doe"
                position={"absolute"}
                src={post?.replies[0]?.userProfilePic}
                top="0px"
                left="15px"
                padding="2px"
              />
            )}
            {post?.replies[1] && (
              <Avatar
                size={"xs"}
                name="john doe"
                position={"absolute"}
                src={post?.replies[1]?.userProfilePic}
                top="0px"
                left="15px"
                padding="2px"
              />
            )}
            {post?.replies[2] && (
              <Avatar
                size={"xs"}
                name="john doe"
                position={"absolute"}
                src={post?.replies[2]?.userProfilePic}
                top="0px"
                left="15px"
                padding="2px"
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap="2">
          <Flex justifyContent={"space-between"} w="full">
            <Flex alignItems={"space-between"} w="full">
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user?.username}`);
                }}
              >
                {user?.name}
              </Text>
              <Image src="/verified.png" w="4" h="4" ml="1" />
            </Flex>
            <Flex
              gap="4"
              alignItems={"center"}
              onClick={(e) => e.preventDefault()}
            >
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post?.createdAt))} ago
              </Text>
              {currentUser?._id === user?._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}

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

          <Text fontSize={"sm"}>{post?.text}</Text>
          {post?.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post?.img} w="full" />
            </Box>
          )}
          <Flex gap="3" my="1">
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};
export default Post;
