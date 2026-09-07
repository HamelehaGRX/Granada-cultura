export type Subcategory = {
  /** Único dentro de categoryId; puede repetirse en otra categoría. */
  id: string;
  categoryId: string;
  name: string;
  illustrationKey?: string;
};

export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};
