import { Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./../atoms/user.atoms";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { HiOutlineLogout } from "react-icons/hi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/auth.Atoms";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  console.log(user);
  //console.log(user);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mt="6" mb={12}>
      {user && (
        <Link to={"/"}>
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link to={"/auth"} onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          {/* <LogoutButton /> */}
          <Link to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Button
            //position={"fixed"}
            // top="30px"
            // right={"30px"}
            size="sm"
            onClick={logout}
          >
            <HiOutlineLogout />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign up
        </Link>
      )}
    </Flex>
  );
};
export default Header;
