import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";

import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atoms";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/posts.Atoms";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  //console.log(user);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  //console.log(currentUser);
  const [posts, setPosts] = useRecoilState(postsAtom);
  //console.log(posts);
  const { pid } = useParams();
  const navigate = useNavigate();
  const currentPost = posts[0];
  useEffect(() => {
    const getPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch("/api/posts/" + pid);
        const data = await res.json();
        //console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        //console.log(data);
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPosts();
  }, [showToast, pid, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    );
  }
  if (!currentPost) {
    return null;
  }
  //console.log(post);

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      const res = await fetch("/api/posts/" + currentPost?._id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted successfully", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return (
    <>
      <Flex>
        <Flex w="full" alignItems={"center"} gap="3">
          <Avatar src={user?.profilePic} size={"md"} name={user?.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h="4" ml="4" />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text width={36} fontSize={"xs"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              cursor={"pointer"}
              size={20}
              onClick={handleDeletePost}
            ></DeleteIcon>
          )}
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my="3">{currentPost?.text}</Text>
      {currentPost?.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost?.img} w="full" />
        </Box>
      )}
      <Flex gap="3" my="3">
        <Actions post={currentPost} />
      </Flex>
      {/* <Flex gap="2" alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post?.replies.length} replies
        </Text>
        <Box w="0.5" h="0.5" borderRadius={"full"} bg="gray.light"></Box>
        <Text fontSize={"sm"} color={"gray.light"}>
          {post?.likes.length} likes
        </Text>
      </Flex> */}
      <Divider my="3" />

      <Flex justifyContent={"space-between"}>
        <Flex gap="2" alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color="gray.light">Get the app to like and post, reply</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      {currentPost?.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost?.replies[currentPost?.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};
export default PostPage;
