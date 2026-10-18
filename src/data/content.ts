/** Content shapes for src/data/**.json. Fields marked HTML are rendered with set:html. */

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteData {
  name: string;
  url: string;
  indexable: boolean;
  logo: string;
  nav: Link[];
  /** Label on the header button that opens the command palette. */
  paletteLabel: string;
  palettePlaceholder: string;
  paletteEmpty: string;
  themeLabel: string;
  contact: Link[];
  /** HTML. */
  footer: string;
}

export interface Meta {
  title: string;
  description: string;
}

/** Shared by every section so `id` and heading come from data. */
export interface SectionBase {
  id: string;
  title: string;
}

/** The editable intro: these exact fields are what the RepoCMS demo edits. */
export interface IntroContent {
  title: string;
  sub: string;
  /** Path to the hero photo; the RepoCMS demo swaps it from the media library. */
  photo: string;
}

export interface MediaItem {
  src: string;
  label: string;
}

export interface IntroData {
  id: string;
  photoAlt: string;
  photoWidth: number;
  photoHeight: number;
  content: IntroContent;
  demo: {
    file: string;
    heading: string;
    /** HTML. */
    body: string;
    /** type: "text", "textarea" or "media". */
    fields: { key: string; label: string; type: string }[];
    media: MediaItem[];
    uploadLabel: string;
    uploadPath: string;
    commitLabel: string;
    resetLabel: string;
    commitNote: string;
    noJs: string;
  };
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  status: string;
  desc: string;
  stack: string[];
  links: Link[];
  /** Which inline demo to render, if any: "repocms", "richmenu" or "qafied". */
  demo?: string;
  /** Shown instead of desc/stack while a write-up is pending. */
  draftNote?: string;
}

export interface RichMenuDemoText {
  heading: string;
  body: string;
  gridLabel: string;
  undoLabel: string;
  clearLabel: string;
  outputLabel: string;
  noJs: string;
}

export interface QafiedDemoText {
  heading: string;
  body: string;
  startLabel: string;
  stopLabel: string;
  hint: string;
  typeLabel: string;
  types: string[];
  commentLabel: string;
  commentPlaceholder: string;
  saveLabel: string;
  cancelLabel: string;
  outputLabel: string;
  empty: string;
  clearLabel: string;
  noJs: string;
}

export interface ProductsData extends SectionBase {
  intro: string;
  repoDemoLink: string;
  richMenu: RichMenuDemoText;
  qafied: QafiedDemoText;
  items: Product[];
}

export interface WorkflowItem {
  title: string;
  desc: string;
}

export interface WorkflowData extends SectionBase {
  intro: string;
  items: WorkflowItem[];
}

export interface ClientProject {
  title: string;
  kind: string;
  desc: string;
  stack: string[];
}

export interface ClientWorkData extends SectionBase {
  intro: string;
  items: ClientProject[];
  /** HTML. */
  footer: string;
}

export interface BackgroundData extends SectionBase {
  /** HTML, one entry per paragraph. */
  paragraphs: string[];
  stackLabel: string;
  stack: { area: string; tools: string }[];
}

export interface Review {
  text: string;
  author: string;
}

export interface ReviewsData extends SectionBase {
  items: Review[];
  /** HTML. */
  summary: string;
}

export interface NowData extends SectionBase {
  timeLabel: string;
  timeFallback: string;
  items: { label: string; value: string }[];
  builtLabel: string;
}

export interface ContactData extends SectionBase {
  body: string;
}

export interface HomePage {
  meta: Meta;
  sourceLabel: string;
  intro: IntroData;
  products: ProductsData;
  workflow: WorkflowData;
  clientWork: ClientWorkData;
  background: BackgroundData;
  reviews: ReviewsData;
  now: NowData;
  contact: ContactData;
}
