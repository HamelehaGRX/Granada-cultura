import type { CategoryRepository } from '../../categories/repositories/CategoryRepository';
import { FixtureCategoryRepository } from '../../categories/repositories/FixtureCategoryRepository';
import type { EventRepository } from './EventRepository';
import { FixtureEventRepository } from './FixtureEventRepository';

export type HomeRepositories = {
  events: EventRepository;
  categories: CategoryRepository;
};

/** Punto de composición sustituible por repositorios remotos, sin framework DI. */
export function createHomeRepositories(): HomeRepositories {
  return {
    events: new FixtureEventRepository(),
    categories: new FixtureCategoryRepository(),
  };
}
