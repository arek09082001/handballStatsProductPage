export interface NavigationChild {
  ident: number;
  href: string;
  /** Key under `navigationSection.items`. Omit when `label` is set. */
  labelKey?: string;
  /**
   * Literal label for entries whose copy lives in a feature data module
   * instead of `messages/*.json`. Wins over `labelKey` when both are set.
   */
  label?: string;
}

export interface NavigationGroup {
  /** Key under `navigationSection.groups`. */
  labelKey: string;
  items: NavigationChild[];
}

export interface NavigationItem {
  ident: number;
  /** Target route. Omitted for items that only open a dropdown. */
  href?: string;
  labelKey: string;
  /**
   * Shown in the desktop navigation row. The desktop row is deliberately kept
   * short — five entries plus the demo button; everything else lives in the
   * mobile menu and the footer.
   */
  primary?: boolean;
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
