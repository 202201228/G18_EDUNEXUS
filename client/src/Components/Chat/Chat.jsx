import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import axios from 'axios';
import ChatIconImage from '../../Images/chatIcon.png';
import '../../CSS/Chat.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

let ENDPOINT = 'http://localhost:3001';

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState(["Welcome! How can we help you?"]); // Example initial message
  const [textMessage, setTextMessage] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [courses, setCourses] = useState([]); // State for course list

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo(storedUserInfo);
      console.log(storedUserInfo);
      if (storedUserInfo) {
        fetchMessages(storedUserInfo);
        fetchCourses(storedUserInfo);
      }
    }
  }, [value, isOpen]);

  const fetchMessages = async (userInfo) => {
    try {
      const response = await axios.post(
        `${ENDPOINT}/api/groupChat/messages`,
        { courseId: value },
        {
          headers: {  // Corrected 'heade' to 'headers'
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  const fetchCourses = async (userInfo) => {
    try {
      const response = await axios.post(
        `${ENDPOINT}/api/groupChat/courses`,
        { SID: userInfo.SID },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setCourses(response.data); // Set courses data instead of messages
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };


  const handleMessageChange = (msg) => {
    setTextMessage(msg.target.value);
  };


  const handleSendMessage = async () => {
    if (!textMessage || !value || !userInfo) return;
  
    try {
      const response = await axios.post(
        `${ENDPOINT}/api/groupChat/send`,
        {
          content: textMessage,
          senderId: userInfo.SID, // Assuming SID is the sender ID
          courseId: value
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      // Add the message to local state after a successful send
      const newMessage = {
        content: textMessage,
        senderId: userInfo.SID,
        courseId: value,
        mtime: new Date() // Use the local time for immediate display
      };
  
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextMessage(''); // Clear the text input
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  return (
    <>
      <Box sx={{ '& > :not(style)': { m: 1 }, background: 'transparent' }}>
        <Fab
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: 'white',
          }}
          onClick={toggleChat}
        >
          <img
            src={ChatIconImage}
            alt="Chat Icon"
            style={{
              width: '100%',
              height: '100%',
              padding: '0px',
            }}
          />
        </Fab>
      </Box>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>
              <Select
                value={value}
                onChange={handleChange}
                sx={{
                  width: '200px',
                  height: '30px',
                  backgroundColor: 'transparent',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  marginLeft: '10px',
                }}
              >
                {courses.map((course, index) => (
                  <MenuItem key={index} value={course.course_code}>
                    {course.course_code} - {course.prof_name}
                  </MenuItem>
                ))}
              </Select>
            </span>
            <button onClick={toggleChat} className="close-btn">
              ✖
            </button>
          </div>
          <div className="chat-content" style={{ display: 'flex', flexDirection: 'column', height: '500px', justifyContent: 'space-between' }}>
  <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px', marginBottom: '10px' }}>
    {messages.map((msg, index) => (
      <p key={index}>{msg.content}</p> // Accessing the content property of each message object
    ))}
  </div>
  <Box sx={{ display: 'flex', borderTop: '1px solid #ccc', padding: '5px' }}>
    <TextField
      id="standard-basic"
      label="Message"
      variant="standard"
      sx={{
        width: '70%',
        marginRight: '10px',
      }}
      onChange={handleMessageChange}
      value={textMessage}
    />
    <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage} sx={{ height: '40px' }}>
      Send
    </Button>
  </Box>
</div>

        </div>
      )}
    </>
  );
}

export default Chat;
