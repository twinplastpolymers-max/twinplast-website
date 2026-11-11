export interface CanonicalProductRoute {
  readonly slug: string;
  readonly title: string;
}

export const CANONICAL_PRODUCT_ROUTES = {
  corrugatedSheet: {
    slug: 'pp-corrugated-sheets',
    title: 'PP Corrugated Sheet',
  },
  sunpackSheet: {
    slug: 'pp-sunpack-sheets',
    title: 'PP Sunpack Sheet',
  },
  floorProtectionSheet: {
    slug: 'pp-floor-protection-sheets',
    title: 'PP Floor Protection Sheet',
  },
  layerPadSheet: {
    slug: 'pp-layer-pad-sheets',
    title: 'PP Layer Pad Sheet',
  },
  hollowSheet: {
    slug: 'pp-hollow-sheets',
    title: 'PP Hollow Sheets',
  },
  corrugatedBox: {
    slug: 'pp-box-sheets',
    title: 'PP Corrugated Box',
  },
} as const satisfies Record<string, CanonicalProductRoute>;

export type CanonicalProductKey = keyof typeof CANONICAL_PRODUCT_ROUTES;

export interface LocationProductCard extends CanonicalProductRoute {
  desc: string;
}

export function buildLocationProducts(
  items: ReadonlyArray<{ key: CanonicalProductKey; desc: string }>
): LocationProductCard[] {
  return items.map(({ key, desc }) => ({
    ...CANONICAL_PRODUCT_ROUTES[key],
    desc,
  }));
}

export const LEGACY_PRODUCT_SLUG_REDIRECTS = [
  {
    source: '/products/pp-corrugated-sheet',
    destination: `/products/${CANONICAL_PRODUCT_ROUTES.corrugatedSheet.slug}`,
    permanent: true,
  },
  {
    source: '/products/sunpack-sheet',
    destination: `/products/${CANONICAL_PRODUCT_ROUTES.sunpackSheet.slug}`,
    permanent: true,
  },
  {
    source: '/products/floor-protection-sheet',
    destination: `/products/${CANONICAL_PRODUCT_ROUTES.floorProtectionSheet.slug}`,
    permanent: true,
  },
  {
    source: '/products/pp-layer-pad',
    destination: `/products/${CANONICAL_PRODUCT_ROUTES.layerPadSheet.slug}`,
    permanent: true,
  },
  {
    source: '/products/pp-hollow-sheet',
    destination: `/products/${CANONICAL_PRODUCT_ROUTES.hollowSheet.slug}`,
    permanent: true,
  },
  {
    source: '/products/pp-corrugated-box',
    destination: `/products/${CANONICAL_PRODUCT_ROUTES.corrugatedBox.slug}`,
    permanent: true,
  },
] as const;

