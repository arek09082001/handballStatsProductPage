export interface NavigationItem {
  ident: number;
  href: string;
  labelKey: string;
  /**
   * Shown in the desktop navigation row. The desktop row is deliberately kept
   * to four links plus the demo button; everything else lives in the mobile
   * menu and the footer.
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
}
