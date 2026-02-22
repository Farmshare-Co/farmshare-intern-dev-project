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

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
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
          onClick={() => navigate("/")}
        >
          {drawerOpen ? (
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
                sx={{
                  px: drawerOpen ? "8px" : "0px",
                  borderRadius: "8px",
                  justifyContent: drawerOpen ? "flex-start" : "center",
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
                      location.pathname === item.path
                        ? "#fff"
                        : "farmGray.main",
                    minWidth: drawerOpen ? "40px" : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "2px solid #e0e0e0",
            backgroundColor: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 1000,
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
            <IconButton
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{
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
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
