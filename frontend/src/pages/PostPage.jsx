import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w="full" alignItems={"center"} gap="3">
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Mark Zucker berg
            </Text>
            <Image src="/verified.png" w="4" h="4" ml="4" />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={["md", "sm"]} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my="3">Let&apos;s Talk about Threads</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/post1.png"} w="full" />
      </Box>
      <Flex gap="3" my="3">
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap="2" alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w="0.5" h="0.5" borderRadius={"full"} bg="gray.light"></Box>
        <Text fontSize={"sm"} color={"gray.light"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my="3" />

      <Flex justifyContent={"space-between"}>
        <Flex gap="2" alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color="gray.light">Get the app to like and post, reply</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Comment
        comment="looks really good"
        createdAt="2d"
        likes={100}
        username="john doe"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        comment="looks really good 1"
        createdAt="2d"
        likes={122}
        username="arvind kumar"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        comment="looks really good 2"
        createdAt="2d"
        likes={123}
        username="sawan prajapati"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        comment="looks really good 3"
        createdAt="2d"
        likes={100}
        username="manmohan"
        userAvatar="https://bit.ly/dan-abramov"
      />
    </>
  );
};
export default PostPage;
