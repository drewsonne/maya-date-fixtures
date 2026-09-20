#!/usr/bin/env node
'use strict';

// Validates fixture files against schema/fixture.schema.json.
// Exit 0 iff every record in every target file is valid.
// Usage: node scripts/validate.js [file.yaml ...]
// With no arguments, validates schema/example.yaml and every fixtures/**/*.yaml.

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

const ROOT = path.join(__dirname, '..');
const SCHEMA_PATH = path.join(ROOT, 'schema', 'fixture.schema.json');

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8')));

function validateRecords(records) {
  if (validate(records)) {
    return [];
  }
  return validate.errors.map((err) => {
    const match = /^\/(\d+)/.exec(err.instancePath);
    const index = match === null ? null : Number(match[1]);
    const record = index === null ? null : records[index];
    const id =
      record !== null && typeof record === 'object' && typeof record.id === 'string'
        ? record.id
        : index === null
          ? '(file)'
          : `(record ${index})`;
    return `${id}: ${err.instancePath || '/'} ${err.message}`;
  });
}

function validateFile(filePath) {
  let records;
  try {
    records = yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [`could not read or parse: ${err.message}`];
  }
  if (records === null || records === undefined) {
    return []; // an empty fixture file holds zero records
  }
  if (!Array.isArray(records)) {
    return ['top level must be a list of records'];
  }
  return validateRecords(records);
}

function defaultTargets() {
  const targets = [path.join(ROOT, 'schema', 'example.yaml')];
  const fixturesDir = path.join(ROOT, 'fixtures');
  if (fs.existsSync(fixturesDir)) {
    const entries = fs.readdirSync(fixturesDir, { recursive: true, encoding: 'utf8' });
    for (const entry of entries.sort()) {
      if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
        targets.push(path.join(fixturesDir, entry));
      }
    }
  }
  return targets;
}

function main(argv) {
  const targets = argv.length > 0 ? argv : defaultTargets();
  let failed = false;
  for (const target of targets) {
    const errors = validateFile(target);
    const rel = path.relative(process.cwd(), target);
    if (errors.length === 0) {
      console.log(`ok      ${rel}`);
    } else {
      failed = true;
      console.error(`invalid ${rel}`);
      for (const error of errors) {
        console.error(`  ${error}`);
      }
    }
  }
  return failed ? 1 : 0;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { validateRecords, validateFile };
