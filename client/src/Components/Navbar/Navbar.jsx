import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ReportIcon from '@mui/icons-material/Assessment';
import CourseRegIcon from '@mui/icons-material/EditNote';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import { Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

const drawerWidth = 260;


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRadius: '25px',
  marginLeft: '20px',
  boxShadow: theme.shadows[5],
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  borderRadius: '25px',
  marginLeft: '20px',
  boxShadow: theme.shadows[5],
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })( // Change here
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevent scrolling
    '& .MuiDrawer-paper': {
      overflow: 'hidden', // Prevent scrolling in the drawer paper
    },
    variants: [
      {
        props: { open: true },
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: { open: false },
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  })
);

export default function Navbar() {
  const [open, setOpen] = React.useState(window.screen.width < '900' ? false : true);
  const isAbove900px = useMediaQuery('(max-width:900px)');

  const navigate = useNavigate();

const handleLogout = () =>{
  localStorage.removeItem("userInfo");
  localStorage.removeItem("_grecaptcha");

  navigate('/login');

}

  const handleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', scroll: 'none' }}>
      <Paper>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            {isAbove900px && (
              <IconButton onClick={handleDrawer}>
                <MenuIcon />
              </IconButton>
            )}
          </DrawerHeader>
          <Divider />
          <List>
            {['Dashboard', 'Courses', 'Result', 'Chat'].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <Link to={`/${text.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: 'center',
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: 'auto',
                            },
                      ]}
                    >
                      {index === 0 && <DashboardIcon />}
                      {index === 1 && <SchoolIcon />}
                      {index === 2 && <ReportIcon />}
                      {index === 3 && <ChatIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['FeesPayment', 'CourseRegistration', 'Settings'].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <Link to={`/${text.toLowerCase()}`} style={{ textDecoration: 'none' }}>

                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                    {index === 0 && <PaymentIcon />}
                    {index === 1 && <CourseRegIcon />}
                    {index === 2 && <SettingsIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Logout onClick={handleLogout}></Logout>
          <img src="../Images/student.png" alt="Student" />
        </Drawer>
      </Paper>
    </Box>
  );
}
