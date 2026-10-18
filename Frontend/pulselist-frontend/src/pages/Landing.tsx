import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <PageLayout
      title={t("landing.title")}
      subtitle={t("landing.subtitle")}
      maxWidth="md"
    >
      <Paper elevation={6} sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Typography>
            {t("landing.description")}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" onClick={() => navigate("/signup")}>
              {t("landing.createAccount")}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              {t("navigation.login")}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </PageLayout>
  );
}
