import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import useShowToast from "./../hooks/useShowToast";
import { Flex, Spinner, Box, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/posts.Atoms";

const UserPage = () => {
  const { username } = useParams();
  const { user, loading } = useGetUserProfile();
  //console.log(user);
  //console.log(user);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setPosts([]);
        } else {
          setPosts(data);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts]);
  //console.log(posts);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Text>User not found</Text>
      </Flex>
    );
  }

  return (
    <Box>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has no Posts</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} userId={post.postedBy} />
      ))}
    </Box>
  );
};

export default UserPage;
