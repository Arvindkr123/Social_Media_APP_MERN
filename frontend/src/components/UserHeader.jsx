import { VStack, Flex, Box } from "@chakra-ui/layout";
import {
  Avatar,
  Text,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from "@chakra-ui/react";
import {} from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "./../atoms/user.atoms";
import { Link } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
const UserHeader = ({ user }) => {
  //console.log(user);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);
  //console.log(currentUser);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  console.log(following);
  const toast = useToast();
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        // console.log("url copied");
        toast({
          description: "Profile link copied",
          duration: 3000,
          isClosable: true,
          status: "success",
        });
      })
      .catch(() => {});
  };

  const handleFollowAndUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "You must be logged in", "error");
      return;
    }
    try {
      setUpdating(true);
      const res = await fetch(`/api/users/follow/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // console.log(data);
      if (following) {
        showToast("Success", `Unfollowed ${user?.name}`, "success");
        user?.followers.pop();
      } else {
        showToast("Success", `followed ${user?.name}`, "success");
        user?.followers.push(currentUser?._id);
      }
      setFollowing((prev) => !prev);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg="gray.dark"
              color="gray.light"
              p="1"
              borderRadius={"full"}
            >
              thread.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && (
            <Avatar
              name={user?.name}
              src={user?.profilePic || "/zuck-avatar.png"}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user?.profilePic && (
            <Avatar
              name={"No Name"}
              src={"https://bit.ly/broken-link"}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>
      {currentUser?._id === user?._id && (
        <Link to="/updateProfile">
          <Button>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user?._id && (
        <Button onClick={handleFollowAndUnfollow} isLoading={updating}>
          {following ? "unfollow" : "Follow"}
        </Button>
      )}
      <Flex w="full" justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color="gray.light">{user?.followers.length} followers</Text>
          <Box w="1" h="1" bg="gray.light" borderRadius={"full"}></Box>
          <Link color="gray.light">instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size="24" cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size="24" cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg="gray.dark">
                  <MenuItem bg="gray.dark" onClick={copyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w="full">
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};
export default UserHeader;
