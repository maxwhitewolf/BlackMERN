import { Backdrop, Box, Card, Modal, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getUserLikes } from "../api/posts";
import Loading from "./Loading";
import UserEntry from "./UserEntry";

const styles = {
  container: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxWidth: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    borderRadius: 3,
    padding: 2,
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
    },
  },
  card: {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'var(--glass-shadow-lg)',
    borderRadius: 3,
    padding: 3,
    transition: 'var(--transition-normal)',
    animation: 'scaleIn 0.3s ease-out',
  },
  title: {
    borderBottom: '1px solid var(--glass-border-light)',
    paddingBottom: 2,
    marginBottom: 2,
    fontWeight: 600,
    background: 'var(--glass-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
};

const UserLikeModal = ({ postId, open, setOpen }) => {
  const [userLikes, setUserLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const scrollBoxRef = useRef(null);

  const handleClose = () => setOpen(false);
  const handleBackdropClick = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  const fetchUserLikes = async () => {
    if (loading || !hasMorePages) return;

    setLoading(true);

    let anchor = "";
    if (userLikes && userLikes.length > 0) {
      anchor = userLikes[userLikes.length - 1].id;
    }

    const data = await getUserLikes(postId, anchor);

    setLoading(false);
    if (data.success) {
      setUserLikes([...userLikes, ...data.userLikes]);
      setHasMorePages(data.hasMorePages);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserLikes();
    }
  }, [open]);

  const handleScroll = () => {
    const scrollBox = scrollBoxRef.current;

    if (
      scrollBox.scrollTop + scrollBox.clientHeight >
      scrollBox.scrollHeight - 12
    ) {
      fetchUserLikes();
    }
  };

  useEffect(() => {
    if (!scrollBoxRef.current) {
      return;
    }
    const scrollBox = scrollBoxRef.current;
    scrollBox.addEventListener("scroll", handleScroll);

    return () => {
      scrollBox.removeEventListener("scroll", handleScroll);
    };
  }, [userLikes]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        onClick: handleBackdropClick,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'var(--transition-normal)'
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          opacity: '1 !important'
        }
      }}
    >
      <Box
        sx={styles.container}
        ref={scrollBoxRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Card sx={styles.card}>
          <Typography variant="h5" sx={styles.title}>
            Liked by
          </Typography>
          <Stack>
            <Stack spacing={2}>
              {userLikes &&
                userLikes.map((like) => (
                  <UserEntry username={like.username} key={like.username} />
                ))}
            </Stack>
            {loading ? <Loading /> : hasMorePages && <Box py={6}></Box>}
          </Stack>
        </Card>
      </Box>
    </Modal>
  );
};

export default UserLikeModal;
