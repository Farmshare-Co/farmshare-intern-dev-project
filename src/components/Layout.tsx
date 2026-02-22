import type { ReactNode } from "react";
import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Breadcrumbs,
  Link,
  Avatar,
  IconButton,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { farmshare_text, farmshare_logo } from "../assets";

const drawerWidthOpen = 240;
const drawerWidthClosed = 80;

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Calculator", icon: <CalculateIcon />, path: "/calculator" },
  { text: "Comparisons", icon: <CompareArrowsIcon />, path: "/comparisons" },
  { text: "Charts", icon: <BarChartIcon />, path: "/charts" },
];

// Map paths to breadcrumb labels
const pathToBreadcrumb: Record<string, string> = {
  "/": "Home",
  "/calculator": "Calculator",
  "/comparisons": "Comparisons",
  "/charts": "Charts",
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const generateBreadcrumbs = () => {
    // Home page shows only "Home"
    if (location.pathname === "/") {
      return [{ label: "Home", path: "/" }];
    }

    const paths = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [{ label: "Home", path: "/" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = pathToBreadcrumb[currentPath] || path;
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const drawerContent = (isMobile: boolean) => (
    <>
      <Toolbar
        sx={{
          alignItems: "center",
          justifyContent: "center",
          pt: "10px",
          pb: "10px",
          cursor: "pointer",
          minHeight: "64px !important",
          mb: 2,
        }}
        onClick={() => {
          navigate("/");
          if (isMobile) setMobileDrawerOpen(false);
        }}
      >
        {isMobile || drawerOpen ? (
          <img src={farmshare_text} alt="logo" width={150} />
        ) : (
          <img src={farmshare_logo} alt="logo" width={40} />
        )}
      </Toolbar>

      {/* Navigation Menu */}
      <List sx={{ mx: "10px" }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: "8px" }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => {
                if (isMobile) setMobileDrawerOpen(false);
              }}
              sx={{
                px: isMobile || drawerOpen ? "8px" : "0px",
                borderRadius: "8px",
                justifyContent:
                  isMobile || drawerOpen ? "flex-start" : "center",
                "&:hover": {
                  color: "farmOrange.main",
                  "& .MuiListItemIcon-root": {
                    color: "farmOrange.main",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "farmGreen.main",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "farmGreen.main",
                    color: "#fff",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#fff",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? "#fff" : "farmGray.main",
                  minWidth: isMobile || drawerOpen ? "40px" : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {(isMobile || drawerOpen) && (
                <ListItemText primary={item.text} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Drawer (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidthOpen,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRight: "2px solid #e0e0e0",
          },
        }}
      >
        {drawerContent(true)}
      </Drawer>

      {/* Desktop Drawer (permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerOpen ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          transition: "width 0.3s ease",
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidthOpen : drawerWidthClosed,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRight: "2px solid #e0e0e0",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        {drawerContent(false)}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fafafa",
          minHeight: "100vh",
          width: { xs: "100%", md: "auto" },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            borderBottom: "2px solid #e0e0e0",
            backgroundColor: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 1100,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Mobile hamburger menu */}
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                backgroundColor: "#f5f5f5",
                border: "1px solid #e0e0e0",
                p: 2,
                width: "12px",
                height: "12px",
                "&:hover": {
                  backgroundColor: "#ececec",
                },
              }}
            >
              <MenuIcon sx={{ width: "18px", height: "18px" }} />
            </IconButton>

            {/* Desktop drawer toggle */}
            <IconButton
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{
                display: { xs: "none", md: "flex" },
                backgroundColor: "#f5f5f5",
                border: "1px solid #e0e0e0",
                p: 2,
                width: "12px",
                height: "12px",
                "&:hover": {
                  backgroundColor: "#ececec",
                },
              }}
            >
              {drawerOpen ? (
                <MenuOpenIcon sx={{ width: "18px", height: "18px" }} />
              ) : (
                <MenuIcon sx={{ width: "18px", height: "18px" }} />
              )}
            </IconButton>

            <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "12px" }}>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography
                    key={crumb.path}
                    color="text.primary"
                    sx={{ fontSize: "12px" }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.path}
                    component={RouterLink}
                    to={crumb.path}
                    underline="hover"
                    color="inherit"
                    sx={{ fontSize: "12px" }}
                  >
                    {crumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>

          <Avatar
            sx={{
              bgcolor: "farmOrange.main",
              width: "30px",
              height: "30px",
              cursor: "pointer",
            }}
          >
            J
          </Avatar>
        </Box>

        {/* Page Content */}
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
