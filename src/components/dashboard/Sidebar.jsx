import React, { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
} from "@mui/material";
import {
  WorkspacePremium,
  Add,
  Explore,
  Star,
  Whatshot,
  Favorite,
  Schedule,
  History,
  Palette,
  Science,
  Movie,
  Logout,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import ComingSoonModal from "./temp/ComingSoonModal";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    backgroundColor: theme.palette.background.secondary,
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3, 2),
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(0, 1),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}));

const CreateButton = styled(Button)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const NavSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.disabled,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.active": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
  },
}));

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { logout } = useAuth();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const mainNavItems = [
    { text: "Discover", icon: <Explore />, badge: null },
    { text: "Featured", icon: <Star />, badge: "IN" },
    { text: "Trending", icon: <Whatshot />, badge: "🔥" },
    { text: "For You", icon: <Favorite />, badge: null },
    { text: "Recent", icon: <Schedule />, badge: null },
  ];

  const historyItems = [
    { text: "History", icon: <History />, badge: null },
  ];

  const categoryItems = [
    { text: "Art & Culture", icon: <Palette />, badge: null },
    { text: "Science", icon: <Science />, badge: null },
    { text: "Entertainment", icon: <Movie />, badge: null },
  ];

  const handleNavClick = (text) => {
    onSectionChange(text);
  };

  const handleCreateClick = () => {
    setComingSoonOpen(true);
  };

  const renderNavSection = (items, title) => (
    <NavSection>
      {title && <SectionTitle>{title}</SectionTitle>}
      <List dense>
        {items.map((item) => (
          <StyledListItem
            key={item.text}
            button
            className={activeSection === item.text ? "active" : ""}
            onClick={() => handleNavClick(item.text)}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </StyledListItem>
        ))}
      </List>
    </NavSection>
  );

  return (
    <>
      <StyledDrawer variant="permanent">
        <Logo>
          <LogoIcon>
            <WorkspacePremium fontSize="small" />
          </LogoIcon>
          <Typography variant="h6" fontWeight="bold">
            Bring Back Legend
          </Typography>
        </Logo>

        <CreateButton 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateClick}
        >
          Create
        </CreateButton>

        {renderNavSection(mainNavItems, "Explore")}
        {renderNavSection(historyItems, "Activity")}
        {renderNavSection(categoryItems, "Categories")}

        <Box sx={{ mt: "auto" }}>
          <StyledListItem button onClick={logout}>
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </StyledListItem>
        </Box>
      </StyledDrawer>

      <ComingSoonModal 
        open={comingSoonOpen} 
        onClose={() => setComingSoonOpen(false)} 
      />
    </>
  );
};

export default Sidebar;