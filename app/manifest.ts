import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Funzip Kashmir Tour & Travels",
    short_name: "Funzip",
    description:
      "Kashmir tour packages, travel guides, galleries, and lead generation for Funzip Kashmir Tour & Travels.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5fb",
    theme_color: "#f7f5fb",
    icons: [
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
