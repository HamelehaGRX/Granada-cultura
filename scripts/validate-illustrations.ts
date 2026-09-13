/// <reference types="node" />

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

import { FixtureEventRepository } from '../src/features/events/repositories/FixtureEventRepository';
import {
  eventIllustrationKeys,
  hasEventIllustration,
  resolveEventIllustration,
} from '../src/features/events/illustrations/illustrationMap';

const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

function legacyImports(projectRoot: string): string[] {
  const sourceRoot = join(projectRoot, 'src');
  const legacyRoot = resolve(projectRoot, 'app');
  const importPattern = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
  const matches: string[] = [];

  for (const file of sourceFiles(sourceRoot)) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1].replaceAll('\\', '/');
      const target = specifier.startsWith('.') ? resolve(dirname(file), specifier) : null;
      if (specifier === '/app' || specifier.startsWith('/app/')
        || target === legacyRoot || target?.startsWith(`${legacyRoot}${sep}`)) {
        matches.push(`${relative(projectRoot, file)} -> ${match[1]}`);
      }
    }
  }

  return matches;
}

async function main() {
  const results = await new FixtureEventRepository({ referenceDate: '2026-09-03' }).list();
  const demoKeys = [...new Set(results.map(result => result.event.illustrationKey ?? 'generica'))];

  assert.equal(eventIllustrationKeys.length, 15);
  for (const key of demoKeys) {
    assert.equal(hasEventIllustration(key), true, `Falta la ilustración demo: ${key}`);
    assert.doesNotThrow(() => resolveEventIllustration(key));
    assert.equal(resolveEventIllustration(key).key, key);
  }
  assert.equal(resolveEventIllustration().key, 'generica');
  assert.equal(resolveEventIllustration('no-existe').key, 'generica');
  assert.equal(hasEventIllustration('no-existe'), false);
  assert.deepEqual(legacyImports(process.cwd()), []);

  console.log(`OK ilustraciones: ${demoKeys.length} claves demo, fallback y clave desconocida.`);
  console.log('OK independencia: ningún import activo de Expo resuelve dentro de /app.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
