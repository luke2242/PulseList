import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AlbumIcon from "@mui/icons-material/Album";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "../config/authConfig";

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      queryClient.clear();
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(10, 10, 10, 0.78)",
        borderBottom: "1px solid rgba(250, 235, 215, 0.2)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label={`PulseList ${t("navigation.home")}`}
          onClick={() => navigate("/home")}
        >
          <AlbumIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            mr: 1,
            fontWeight: 800,
            letterSpacing: "0.14rem",
          }}
        >
          PULSELIST
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate("/home")}>
            {t("navigation.home")}
          </Button>
          <Button
            color="inherit"
            startIcon={<SearchIcon />}
            onClick={() => navigate("/search")}
          >
            {t("navigation.search")}
          </Button>
          <Button
            color="inherit"
            startIcon={<TrendingUpIcon />}
            onClick={() => navigate("/trending")}
          >
            {t("navigation.trending")}
          </Button>
          <Button
            color="inherit"
            startIcon={<LibraryMusicIcon />}
            onClick={() => navigate("/account")}
          >
            {t("navigation.yourList")}
          </Button>

          {!user ? (
            <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
              {t("navigation.login")}
            </Button>
          ) : (
            <Button variant="outlined" color="primary" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? t("navigation.loggingOut") : t("navigation.logout")}
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
