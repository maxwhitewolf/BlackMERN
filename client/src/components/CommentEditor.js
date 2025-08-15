import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createComment } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ErrorAlert from "./ErrorAlert";
import HorizontalStack from "./util/HorizontalStack";

const CommentEditor = ({ label, comment, addComment, setReplying }) => {
  const [formData, setFormData] = useState({
    content: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      parentId: comment && comment._id,
    };

    setLoading(true);
    const data = await createComment(body, params, isLoggedIn());
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      formData.content = "";
      setReplying && setReplying(false);
      addComment(data);
    }
  };

  const handleFocus = (e) => {
    !isLoggedIn() && navigate("/login");
  };

  return (
    <Card sx={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      borderRadius: 3,
      p: 2,
      transition: 'var(--transition-normal)',
      '&:hover': {
        boxShadow: 'var(--glass-shadow-lg)',
        borderColor: 'var(--glass-border-hover)'
      }
    }}>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <Typography variant="h5">
            {comment ? <>Reply</> : <>Comment</>}
          </Typography>
          <Typography>
            <Box
              component="a"
              href="https://commonmark.org/help/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                position: 'relative',
                transition: 'var(--transition-fast)',
                '&:hover': {
                  color: 'primary.light',
                  textShadow: '0 0 8px rgba(16, 163, 127, 0.6)',
                  '&::after': {
                    width: '100%'
                  }
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  background: 'var(--glass-gradient)',
                  transition: 'var(--transition-fast)'
                }
              }}
            >
              Markdown Help
            </Box>
          </Typography>
        </HorizontalStack>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            multiline
            fullWidth
            label={label}
            rows={5}
            required
            name="content"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'var(--glass-bg-light)',
                backdropFilter: 'var(--glass-blur-sm)',
                WebkitBackdropFilter: 'var(--glass-blur-sm)',
                border: '1px solid var(--glass-border-light)',
                borderRadius: 2,
                transition: 'var(--transition-normal)',
                '&:hover': {
                  borderColor: 'var(--glass-border-hover)'
                },
                '&.Mui-focused': {
                  borderColor: 'primary.main',
                  boxShadow: 'var(--glass-focus)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
            onChange={handleChange}
            onFocus={handleFocus}
            value={formData.content}
          />

          <ErrorAlert error={error} sx={{ my: 4 }} />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              border: '1px solid var(--glass-border)',
              borderRadius: 2,
              color: 'primary.main',
              fontWeight: 600,
              mt: 2,
              p: 1.5,
              transition: 'var(--transition-normal)',
              '&:hover': {
                background: 'var(--glass-bg-light)',
                borderColor: 'var(--glass-border-hover)',
                boxShadow: 'var(--glass-shadow)',
                transform: 'translateY(-2px)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: 'var(--glass-shadow-sm)'
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            {loading ? <div>Submitting...</div> : <div>Submit</div>}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default CommentEditor;
