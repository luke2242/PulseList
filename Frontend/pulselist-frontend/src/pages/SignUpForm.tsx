import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getIdToken, updateProfile } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { auth } from "../firebaseConfig";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(credential.user, {
        displayName: username,
      });

      const token = await getIdToken(credential.user);

      const res = await axios.post(
        import.meta.env.VITE_PULSELIST_ADDUSERURL,
        {
          username,
          email: credential.user.email,
          uid: credential.user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    },
    onSuccess: () => {
      navigate("/home");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Box
      sx={() => ({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 6
      })}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: { xs: 3, sm: 5 }, color: "text.primary" }}>
          <Stack spacing={3}>
            <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: "0.2rem" }}>
                {t("auth.joinTitle")}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {t("auth.joinSubtitle")}
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  type="text"
                  label={t("auth.username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  type="email"
                  label={t("auth.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  type="password"
                  label={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />

                <Button type="submit" variant="contained" color="primary" size="large" disabled={isPending}>
                  {isPending ? t("auth.registering") : t("auth.signUp")}
                </Button>

                {isError ? (
                  <Alert severity="error">
                    {t("auth.error", { message: (error as any)?.response?.data?.message || error.message })}
                  </Alert>
                ) : null}
              </Stack>
            </Box>

            <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
              {t("auth.alreadyHaveAccount")}{" "}
              <Link component={RouterLink} to="/login">
                {t("auth.loginHere")}
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignUpForm;
