// Abstract network for the ecosystem globe.
// Coordinates are illustrative only — they do not represent Foxses offices
// or infrastructure, so nodes are intentionally unlabeled.

export interface GlobeNode {
  id: string;
  lng: number;
  lat: number;
}

export interface GlobeArc {
  from: string;
  to: string;
}

// Hub points that a few arcs converge on — data flowing into one shared platform
export const HUB_NODE_IDS = ["hub", "n8", "n16"];

export interface GlobeAnnotation {
  node: string;
  title: string;
  detail: string;
  /** Hidden on small screens to keep the globe uncluttered */
  desktopOnly?: boolean;
}

// What Foxses builds — shown one or two at a time as the globe turns
export const GLOBE_ANNOTATIONS: GlobeAnnotation[] = [
  { node: "n3", title: "Business software", detail: "Invoice · Inventory · HR · Forms" },
  { node: "n8", title: "Developer tools", detail: "Payments · APIs · SDKs", desktopOnly: true },
  { node: "n17", title: "Cloud & infrastructure", detail: "Domains · Hosting · Cloud" },
];

export const GLOBE_NODES: GlobeNode[] = [
  { id: "hub", lng: 12, lat: 49 },
  { id: "flow", lng: -92, lat: 39 },
  { id: "n1", lng: -122, lat: 45 },
  { id: "n2", lng: -74, lat: 43 },
  { id: "n3", lng: -99, lat: 21 },
  { id: "n4", lng: -58, lat: -30 },
  { id: "n5", lng: -45, lat: -12 },
  { id: "n6", lng: -76, lat: 4 },
  { id: "n7", lng: -2, lat: 54 },
  { id: "n8", lng: 26, lat: 60 },
  { id: "n9", lng: 4, lat: 40 },
  { id: "n10", lng: 6, lat: 8 },
  { id: "n11", lng: 30, lat: -24 },
  { id: "n12", lng: 37, lat: 2 },
  { id: "n13", lng: 46, lat: 27 },
  { id: "n14", lng: 76, lat: 20 },
  { id: "n15", lng: 66, lat: 42 },
  { id: "n16", lng: 104, lat: 33 },
  { id: "n17", lng: 120, lat: 2 },
  { id: "n18", lng: 136, lat: 36 },
  { id: "n19", lng: 146, lat: -30 },
  { id: "n20", lng: 174, lat: -40 },
  { id: "n21", lng: 92, lat: 56 },
  { id: "n22", lng: -150, lat: 62 },
];

// Globe-to-globe connections (no hub-and-spoke). A few converge on the hubs.
export const GLOBE_ARCS: GlobeArc[] = [
  { from: "flow", to: "n2" },
  { from: "n2", to: "n7" },
  { from: "n7", to: "hub" },
  { from: "n13", to: "hub" },
  { from: "n10", to: "hub" },
  { from: "n1", to: "flow" },
  { from: "n3", to: "n6" },
  { from: "n6", to: "n5" },
  { from: "n5", to: "n4" },
  { from: "n4", to: "n11" },
  { from: "n9", to: "n10" },
  { from: "n12", to: "n13" },
  { from: "n13", to: "n14" },
  { from: "n14", to: "n17" },
  { from: "n15", to: "n16" },
  { from: "n16", to: "n18" },
  { from: "n17", to: "n19" },
  { from: "n19", to: "n20" },
  { from: "n8", to: "n21" },
  { from: "n22", to: "n1" },
  { from: "n18", to: "n22" },
];
