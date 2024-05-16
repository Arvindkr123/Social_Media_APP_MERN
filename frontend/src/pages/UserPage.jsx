import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useEffect, useState } from "react";
import useShowToast from "./../hooks/useShowToast";

const UserPage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  //console.log(user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        //console.log(data);
        setUser(data.user);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
      } catch (error) {
        showToast("Error", error, "error");
        console.log(error);
      }
    };
    getUser();
  }, [username, showToast]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={481}
        postImg={"/post1.png"}
        title="Let's talk about threads"
      />
      <UserPost
        likes={451}
        replies={123}
        postImg={"/post2.png"}
        title="Let's do something"
      />
      <UserPost
        likes={687}
        replies={433}
        postImg={"/post3.png"}
        title="I love this guy"
      />
      <UserPost
        likes={366}
        replies={212}
        postImg={"/favicon.png"}
        title="this is great thing to say about"
      />
    </div>
  );
};
export default UserPage;
