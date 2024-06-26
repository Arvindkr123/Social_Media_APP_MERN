import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap="4" py="2" my="2" w={"full"}>
        <Avatar src={reply?.userProfilePic} name={reply?.username} size="sm" />
      </Flex>
      <Flex gap="1" w="full" flexDirection={"column"}>
        <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {reply?.username}
          </Text>
        </Flex>
        {/* ---------- comment goes here -------------- */}
        <Text>{reply?.text}</Text>
      </Flex>
      {!lastReply ? <Divider my="4" /> : null}
    </>
  );
};
export default Comment;
