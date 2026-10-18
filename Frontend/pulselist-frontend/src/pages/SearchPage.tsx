import { useState } from "react";
import {   useInfiniteQuery, type InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, MenuItem, Paper, Select, Stack, TextField, Typography,} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchDebounce } from "../hooks/useSearchDebounce";
import { getSearchResults } from "../api/discogsApi";
import { addToList } from "../api/listManagementApi";
import type { DiscogsSearchResultDTO } from "../types/discogs";
import { LISTENING_STATUSES, type ListeningStatus} from "../types/listStatus";
import PageLayout from "../components/PageLayout";

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Record<number, ListeningStatus>>({});
  const queryClient = useQueryClient();

  const debouncedSearchTerm = useSearchDebounce(searchTerm, 500);

  const addToListMutation = useMutation({
    mutationFn: addToList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-music-list"] });
    },
  });

  const getStatusForRelease = (releaseId: number): ListeningStatus => {
    return selectedStatuses[releaseId] ?? "WANT_TO_LISTEN";
  };

const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    DiscogsSearchResultDTO[],
    Error,
    InfiniteData<DiscogsSearchResultDTO[]>,
    [string, string],
    number
  >({
    queryKey: ["discogs-search", debouncedSearchTerm],
    queryFn: ({ pageParam = 1, signal }) =>
      getSearchResults(debouncedSearchTerm, "release", pageParam, 50, signal),
    enabled: debouncedSearchTerm.trim().length > 0,
    staleTime: 60 * 1000,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 50 ? allPages.length + 1 : undefined,
  });

  const searchResults = data?.pages.flat() ?? [];


  return (
    <PageLayout
      showNavbar
      title={t("search.title")}
      subtitle={t("search.subtitle")}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t("search.placeholder")}
          label={t("search.label")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </Paper>

      {!searchTerm.trim() ? <Typography>{t("search.startTyping")}</Typography> : null}
      {isLoading ? <Typography>{t("search.loading")}</Typography> : null}

      {isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("search.loadError", { message: error.message })}
        </Alert>
      ) : null}

      {!isLoading && !isError && searchTerm.trim() && searchResults.length === 0 ? (
        <Typography>{t("search.noResults")}</Typography>
      ) : null}

      {!isLoading && !isError && searchResults.length > 0 ? (
        <Grid container spacing={2}>
          {searchResults.map((release) => {
            const imageUrl = release.cover_image || release.thumb;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={release.id}>
                <Card sx={{ height: "100%" }}>
                  {imageUrl ? (
                    <CardMedia component="img" height="240" image={imageUrl} alt={release.title} />
                  ) : (
                    <Box
                      sx={{
                        height: 240,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                      }}
                    >
                      {t("search.noImage")}
                    </Box>
                  )}

                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="h6">{release.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {t("common.year", { value: release.year || t("common.unknown") })}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {t("common.country", { value: release.country || t("common.unknown") })}
                      </Typography>

                      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                        <Typography variant="body2">{t("common.status")}</Typography>
                        <Select
                          size="small"
                          value={getStatusForRelease(release.id)}
                          onChange={(e) => {
                            setSelectedStatuses((prev) => ({
                              ...prev,
                              [release.id]: e.target.value as ListeningStatus,
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
                            discogsReleaseId: release.id,
                            discogsTitle: release.title,
                            discogsArtist: release.title.split(" - ")[0] || t("common.unknownArtist"),
                            discogsCoverUrl: imageUrl || undefined,
                            status: getStatusForRelease(release.id),
                          });
                        }}
                      >
                        {t("search.addToList")}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : null}

      {!isLoading && !isError && hasNextPage ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? t("search.loadingMore") : t("search.loadMore")}
          </Button>
        </Box>
      ) : null}
    </PageLayout>
  );
}
