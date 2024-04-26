import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <div>
      <UserHeader />
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
