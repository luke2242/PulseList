import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <PageLayout
      showNavbar
      title="PulseList"
      subtitle={t("home.subtitle")}
      maxWidth="md"
    >
      <Paper elevation={6} sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Typography variant="h5">{t("home.welcome")}</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {t("home.description")}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" onClick={() => navigate("/search")}>
              {t("home.startSearching")}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/trending")}>
              {t("home.exploreTrending")}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/account")}>
              {t("home.openYourList")}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </PageLayout>
  );
}