import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  Skeleton,
  Fade,
  Badge,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Circle as OnlineIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const MessengerContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 100px)',
  display: 'flex',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  overflow: 'hidden',
}));

const UserListSection = styled(Box)(({ theme }) => ({
  width: 320,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

const ChatSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const UserListItem = styled(ListItem)(({ theme, selected }) => ({
  cursor: 'pointer',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.2s ease-in-out',
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: '8px 12px',
  borderRadius: 18,
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.background.surface,
  color: isOwn ? 'white' : theme.palette.text.primary,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: 8,
  wordWrap: 'break-word',
}));

const MessengerView = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/random?size=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      } else {
        // If no messages exist, create empty array
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedUser._id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const LoadingSkeleton = () => (
    <Box>
      {Array.from({ length: 5 }, (_, i) => (
        <Box key={i} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={80} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Messages
        </Typography>
        
        <MessengerContainer>
          {/* User List Section */}
          <UserListSection>
            {/* Search Header */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme => theme.palette.divider}` }}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>

            {/* Users List */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {loading ? (
                <LoadingSkeleton />
              ) : filteredUsers.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {filteredUsers.map((user) => (
                    <UserListItem
                      key={user._id}
                      selected={selectedUser?._id === user._id}
                      onClick={() => handleUserSelect(user)}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <OnlineIcon sx={{ fontSize: 12, color: 'success.main' }} />
                          }
                        >
                          <Avatar
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                            sx={{ width: 48, height: 48, cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user.username);
                            }}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user.username);
                            }}
                          >
                            {user.username}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {user.fullName || 'No bio'}
                          </Typography>
                        }
                      />
                    </UserListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found
                  </Typography>
                </Box>
              )}
            </Box>
          </UserListSection>

          {/* Chat Section */}
          <ChatSection>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme => theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`}
                    sx={{ width: 40, height: 40, cursor: 'pointer' }}
                    onClick={() => handleUserClick(selectedUser.username)}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleUserClick(selectedUser.username)}
                    >
                      {selectedUser.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active now
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <MoreIcon />
                  </IconButton>
                </Box>

                {/* Messages Area */}
                <Box sx={{ flex: 1, p: 2, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <MessageBubble
                        key={index}
                        isOwn={message.sender === 'currentUser'}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </MessageBubble>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No messages yet. Start a conversation!
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: `1px solid ${theme => theme.palette.divider}` }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            sx={{ color: 'primary.main' }}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Select a conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a user from the list to start messaging
                  </Typography>
                </Box>
              </Box>
            )}
          </ChatSection>
        </MessengerContainer>
      </Box>
    </Container>
  );
};

export default MessengerView;
