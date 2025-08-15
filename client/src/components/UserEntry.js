import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Person } from "@mui/icons-material";

const UserEntry = ({ username }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        transition: 'var(--transition-fast)',
        '&:hover': {
          background: 'var(--glass-bg-light)',
          transform: 'translateX(4px)'
        }
      }}
    >
      <HorizontalStack justifyContent="space-between" key={username}>
        <HorizontalStack spacing={1.5}>
          <UserAvatar width={36} height={36} username={username} />
          <Typography sx={{ fontWeight: 500 }}>{username}</Typography>
        </HorizontalStack>
        <Button
          component={Link}
          to={"/users/" + username}
          startIcon={<Person fontSize="small" />}
          size="small"
          sx={{
            background: 'var(--glass-bg-light)',
            backdropFilter: 'var(--glass-blur-sm)',
            WebkitBackdropFilter: 'var(--glass-blur-sm)',
            border: '1px solid var(--glass-border-light)',
            borderRadius: 2,
            color: 'primary.main',
            px: 2,
            '&:hover': {
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border-hover)',
              boxShadow: 'var(--glass-shadow-sm)'
            }
          }}
        >
          View
        </Button>
      </HorizontalStack>
    </Box>
  );
};

export default UserEntry;
