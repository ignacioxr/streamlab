import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ChannelCatalog } from "@/domain/channel";
import { buildChannel } from "@/test/build-channel";
import { renderWithProviders } from "@/test/render-with-providers";
import { ChannelGrid } from "./channel-grid";

function fakeCatalog(listLive: ChannelCatalog["listLive"]): ChannelCatalog {
  return { listLive };
}

describe("ChannelGrid", () => {
  it("renders a card for each live channel", async () => {
    const catalog = fakeCatalog(
      vi
        .fn<ChannelCatalog["listLive"]>()
        .mockResolvedValue([
          buildChannel({ id: "1", slug: "speedrun", title: "Speedrun night" }),
          buildChannel({ id: "2", slug: "lofi", title: "Lo-fi beats" }),
        ]),
    );

    renderWithProviders(<ChannelGrid query={{ limit: 24 }} />, { catalog });

    expect(
      await screen.findByRole("heading", { name: "Speedrun night" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Lo-fi beats" }),
    ).toBeInTheDocument();
  });

  it("shows the skeleton while loading", () => {
    const catalog = fakeCatalog(
      vi
        .fn<ChannelCatalog["listLive"]>()
        .mockReturnValue(new Promise(() => {})),
    );

    renderWithProviders(<ChannelGrid query={{ limit: 24 }} />, { catalog });

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Loading channels")).toBeInTheDocument();
  });

  it("shows empty state when there are no live channels", async () => {
    const catalog = fakeCatalog(
      vi.fn<ChannelCatalog["listLive"]>().mockResolvedValue([]),
    );

    renderWithProviders(<ChannelGrid query={{ limit: 24 }} />, { catalog });

    expect(
      await screen.findByText("No live channels right now."),
    ).toBeInTheDocument();
  });

  it("shows error state", async () => {
    const catalog = fakeCatalog(
      vi.fn<ChannelCatalog["listLive"]>().mockRejectedValue(new Error("boom")),
    );

    renderWithProviders(<ChannelGrid query={{ limit: 24 }} />, { catalog });

    expect(
      await screen.findByText("Could not load channels."),
    ).toBeInTheDocument();
  });

  it("calls the catalog with the query", async () => {
    const listLive = vi.fn<ChannelCatalog["listLive"]>().mockResolvedValue([]);

    renderWithProviders(
      <ChannelGrid query={{ limit: 24, category: "music" }} />,
      { catalog: fakeCatalog(listLive) },
    );

    expect(listLive).toHaveBeenCalledExactlyOnceWith({
      limit: 24,
      category: "music",
    });
  });

  it("shows the first image with high priority", async () => {
    const catalog = fakeCatalog(
      vi
        .fn<ChannelCatalog["listLive"]>()
        .mockResolvedValue([
          buildChannel({ id: "1", slug: "speedrun", title: "Speedrun night" }),
          buildChannel({ id: "2", slug: "lofi", title: "Lo-fi beats" }),
          buildChannel({ id: "3", slug: "foo", title: "Foo Bar" }),
          buildChannel({ id: "4", slug: "baz", title: "Bar Baz" }),
        ]),
    );

    const { container } = renderWithProviders(<ChannelGrid query={{ limit: 24 }} />, { catalog });
    await screen.findByRole("heading", { name: "Speedrun night" })
    const [first, ...rest] = container.querySelectorAll("img");

    expect(first).toHaveAttribute("fetchpriority", "high");
    expect(rest).toHaveLength(3);

    for (const image of rest) {
      expect(image).not.toHaveAttribute("fetchpriority", "high");
    }
  });
});
