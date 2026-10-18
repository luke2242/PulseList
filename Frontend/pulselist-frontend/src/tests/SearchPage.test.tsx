import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import "../../i18n";
import SearchPage from "../pages/SearchPage";
import type { DiscogsSearchResultDTO } from "../types/discogs";

const getSearchResultsMock = vi.fn();
const addToListMock = vi.fn();

vi.mock("../hooks/useSearchDebounce", () => ({
  useSearchDebounce: (value: string) => value,
}));

vi.mock("../api/discogsApi", () => ({
  getSearchResults: (...args: unknown[]) => getSearchResultsMock(...args),
}));

vi.mock("../api/listManagementApi", () => ({
  addToList: (...args: unknown[]) => addToListMock(...args),
}));

vi.mock("../config/authConfig", () => ({
  useAuth: () => ({
    user: null,
    token: null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

function renderWithQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    getSearchResultsMock.mockReset();
    addToListMock.mockReset();
    addToListMock.mockResolvedValue({});
  });

  it("Should show search results and uses thumb when cover_image is missing", async () => {
    const mockResults: DiscogsSearchResultDTO[] = [
      {
        id: 101,
        title: "Daft Punk - Homework",
        year: "1997",
        country: "France",
        cover_image: "",
        thumb: "https://img.discogs.com/daft-thumb.jpg",
      },
    ];

    getSearchResultsMock.mockResolvedValue(mockResults);

    renderWithQueryClient();

    expect(screen.getByText("Start typing to search for releases.")).toBeTruthy();

    await userEvent.type(screen.getByPlaceholderText("Search releases..."), "daft punk");

    await waitFor(() => {
      expect(getSearchResultsMock).toHaveBeenCalledWith(
        "daft punk",
        "release",
        1,
        50,
        expect.any(AbortSignal)
      );
    });

    expect(await screen.findByText("Daft Punk - Homework")).toBeTruthy();

    const image = screen.getByRole("img", { name: "Daft Punk - Homework" });
    expect(image.getAttribute("src")).toBe("https://img.discogs.com/daft-thumb.jpg");
  });
});
