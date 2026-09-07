type LocalBrandAsset = number | null;

export type BrandConfig = Readonly<{
  name: string;
  shortName: string;
  assets: Readonly<{
    logo: LocalBrandAsset;
    icon: LocalBrandAsset;
    mascot: LocalBrandAsset;
  }>;
}>;

/**
 * Identidad provisional. Nombre y assets se sustituyen aquí; tipografía y
 * paleta se sustituyen desde el theme sin reescribir los componentes.
 */
export const BRAND: BrandConfig = {
  name: 'CULTURA',
  shortName: 'CULTURA',
  assets: {
    logo: null,
    icon: null,
    mascot: null,
  },
};
