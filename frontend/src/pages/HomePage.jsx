import { Flex, Spinner } from "@chakra-ui/react";

import useShowToast from "./../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/posts.Atoms";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  //console.log(posts);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        //console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <>
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed posts</h1>
      )}
      {loading && (
        <Flex w="full" justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post post={post} key={post._id} userId={post.postedBy} />
      ))}
    </>
  );
};
export default HomePage;
