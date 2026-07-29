import { describe, expect, it } from "vitest";
import { CONTACT_LOCATION, CONTACT_MAP_LINKS } from "@/lib/contactLocation";

describe("contactLocation", () => {
  it("points at the Neuenburg plant coordinates", () => {
    expect(CONTACT_LOCATION.lat).toBeCloseTo(47.8114, 3);
    expect(CONTACT_LOCATION.lon).toBeCloseTo(7.5529, 3);
  });

  it("exposes outbound map links without embedding third-party scripts", () => {
    expect(CONTACT_MAP_LINKS.openStreetMap).toContain("openstreetmap.org");
    expect(CONTACT_MAP_LINKS.openStreetMap).toContain(String(CONTACT_LOCATION.lat));
    expect(CONTACT_MAP_LINKS.googleMaps).toContain("google.com/maps");
    expect(CONTACT_LOCATION.mapImageSrc).toMatch(/^\/images\/contact\//);
  });
});
