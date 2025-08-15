import { useTheme } from "@emotion/react";
import {
  Avatar,
  IconButton,
  Stack,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import "react-icons/ai";
import "react-icons/ri";
import {
  AiFillFileText,
  AiFillHome,
  AiFillMessage,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import { RiContrast2Line } from "react-icons/ri";

const Navbar = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && isLoggedIn().username;
  // Search functionality removed
  // const [search, setSearch] = useState("");
  // const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleLogout = async (e) => {
    logoutUser();
    navigate("/login");
  };

  // Search functionality removed
  // const handleChange = (e) => {
  //   setSearch(e.target.value);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   navigate("/search?" + new URLSearchParams({ search }));
  // };

  // const handleSearchIcon = (e) => {
  //   setSearchIcon(!searchIcon);
  // };

  return (
    <Stack mb={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 2,
          pb: 0,
        }}
        spacing={!mobile ? 2 : 0}
      >
        <Typography
          sx={{ 
            display: mobile ? "none" : "block",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center"
          }}
          variant={navbarWidth ? "h6" : "h4"}
          color={theme.palette.primary.main}
        >
          PostIt
        </Typography>
        <AiFillFileText
          size={33}
          color={theme.palette.primary.main}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {/* Search box removed */}

        <HorizontalStack>
          {/* Search icon removed */}

          <IconButton component={Link} to={"/"}>
            <AiFillHome />
          </IconButton>
          {user ? (
            <>
              <IconButton component={Link} to={"/messenger"}>
                <AiFillMessage />
              </IconButton>
              <IconButton component={Link}  to={"/users/" + username}>
                <UserAvatar width={30} height={30} username={user.username} />
              </IconButton>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="text" sx={{ minWidth: 80 }} href="/signup">
                Sign Up
              </Button>
              <Button variant="text" sx={{ minWidth: 65 }} href="/login">
                Login
              </Button>
            </>
          )}
        </HorizontalStack>
      </Stack>
      {/* Mobile search box removed */}
    </Stack>
  );
};

export default Navbar;
