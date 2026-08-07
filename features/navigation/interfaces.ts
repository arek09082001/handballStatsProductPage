export interface NavigationLink {
  ident: number;
  href: string;
  /** Key under `navigationSection.items`. Omit when `label` is set. */
  labelKey?: string;
  /**
   * Literal label for entries whose copy lives in a feature data module
   * instead of `messages/*.json`. Wins over `labelKey` when both are set.
   */
  label?: string;
  /** External links open in a new tab and skip active-route matching. */
  external?: boolean;
  /**
   * Id of the in-page section this link points to, used for scroll-spy on the
   * landing page. Omitted for external links and non-anchor routes.
   */
  sectionId?: string;
}

export interface NavigationGroup {
  /** Key under `navigationSection.groups`. */
  labelKey: string;
  items: NavigationLink[];
}

export interface NavigationItem {
  ident: number;
  /** Target route. Omitted for items that only open a dropdown. */
  href?: string;
  labelKey: string;
  /** External links open in a new tab and skip active-route matching. */
  external?: boolean;
  /**
   * Id of the in-page section this item points to, used for scroll-spy on the
   * landing page. Use 'home' for the top of the page. Omitted for external
   * links and non-anchor routes.
   */
  sectionId?: string;
  /**
   * Grouped sub-links. An item that has them renders as a dropdown instead of
   * a link — its own `href` is then unused. The links stay in the server-
   * rendered HTML while the panel is closed so they are crawlable.
   */
  groups?: NavigationGroup[];
}
