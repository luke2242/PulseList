import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { DiscogsDTO } from "../types/discogs";
import { useTrendingReleases } from "../hooks/useTrendingReleases";
import { addToList } from "../api/listManagementApi";
import {
  LISTENING_STATUSES,
  type ListeningStatus,
} from "../types/listStatus";
import PageLayout from "../components/PageLayout";

export default function TrendingPage() {
  const { t } = useTranslation();
  const [selectedStatuses, setSelectedStatuses] = useState<Record<number, ListeningStatus>>({});
  const queryClient = useQueryClient();

  const {
    data: albums = [],
    isLoading,
    error,
  } = useTrendingReleases();

  const addToListMutation = useMutation({
    mutationFn: addToList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-music-list"] });
    },
  });

  const getStatusForAlbum = (albumId: number): ListeningStatus => {
    return selectedStatuses[albumId] ?? "WANT_TO_LISTEN";
  };

  return (
    <PageLayout
      showNavbar
      title={t("trending.title")}
      subtitle={t("trending.subtitle")}
    >
      {isLoading ? <Typography>{t("trending.loading")}</Typography> : null}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("trending.loadError")}
        </Alert>
      ) : null}

      {!isLoading && !error && albums.length === 0 ? (
        <Typography>{t("trending.noResults")}</Typography>
      ) : null}

      {!isLoading && !error && albums.length > 0 ? (
        <Grid container spacing={2}>
          {albums.map((album: DiscogsDTO) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={album.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">{album.title}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {t("common.year", { value: album.year || t("common.unknown") })}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {t("common.country", { value: album.country || t("common.unknown") })}
                    </Typography>

                    <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                      <Typography variant="body2">{t("common.status")}</Typography>
                      <Select
                        size="small"
                        value={getStatusForAlbum(album.id)}
                        onChange={(e) => {
                          setSelectedStatuses((prev) => ({
                            ...prev,
                            [album.id]: e.target.value as ListeningStatus,
                          }));
                        }}
                      >
                        {LISTENING_STATUSES.map((status) => (
                          <MenuItem key={status} value={status}>
                            {t(`statuses.${status}`)}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={() => {
                        addToListMutation.mutate({
                          discogsReleaseId: album.id,
                          discogsTitle: album.title,
                          discogsArtist: album.title.split(" - ")[0] || t("common.unknownArtist"),
                          status: getStatusForAlbum(album.id),
                        });
                      }}
                    >
                      {t("trending.addToList")}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </PageLayout>
  );
}
