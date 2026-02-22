import type { ReactNode } from "react";
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
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BarChartIcon from "@mui/icons-material/BarChart";
import { farmshare_text } from "../assets";

const drawerWidth = 240;

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
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRight: "2px solid #e0e0e0",
          },
        }}
      >
        <Toolbar
          sx={{
            alignItems: "center",
            justifyContent: "center",
            pt: "10px",
            pb: "-10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img src={farmshare_text} alt="logo" width={150} />
        </Toolbar>

        {/* Navigation Menu */}
        <List sx={{ mx: "10px" }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  px: "8px",
                  borderRadius: "8px",
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
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
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
