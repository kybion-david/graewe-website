/** GRAEWE GmbH — Max-Planck-Straße 1-3, 79395 Neuenburg am Rhein */
export const CONTACT_LOCATION = {
  lat: 47.8114043,
  lon: 7.5529321,
  mapImageSrc: "/images/contact/location-map.png",
  mapImageWidth: 800,
  mapImageHeight: 450,
} as const;

export const CONTACT_MAP_LINKS = {
  openStreetMap: `https://www.openstreetmap.org/?mlat=${CONTACT_LOCATION.lat}&mlon=${CONTACT_LOCATION.lon}#map=17/${CONTACT_LOCATION.lat}/${CONTACT_LOCATION.lon}`,
  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=GRAEWE+GmbH+Maschinenbau+Max-Planck-Stra%C3%9Fe+1-3+79395+Neuenburg+am+Rhein",
} as const;
