export interface NavigationItem {
  ident: number;
  href: string;
  labelKey: string;
  /** External links open in a new tab and skip active-route matching. */
  external?: boolean;
}
