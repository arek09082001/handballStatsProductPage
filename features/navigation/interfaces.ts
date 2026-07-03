export interface NavigationItem {
  ident: number;
  href: string;
  labelKey: string;
  /** External links open in a new tab and skip active-route matching. */
  external?: boolean;
  /**
   * Id of the in-page section this item points to, used for scroll-spy on the
   * landing page. Use 'home' for the top of the page. Omitted for external
   * links and non-anchor routes.
   */
  sectionId?: string;
}
