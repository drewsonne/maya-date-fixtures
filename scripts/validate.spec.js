'use strict';

const { execFileSync } = require('node:child_process');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { expect } = require('chai');

const { validateRecords, validateFile } = require('./validate');

// A record carrying every field of the template from the maya-fixtures skill.
function fullRecord(overrides = {}) {
  return {
    id: 'era-base',
    long_count: '13.0.0.0.0',
    calendar_round: "4 Ajaw 8 Kumk'u",
    lord_of_night: 'G9',
    maya_day_number: 1872000,
    julian_day_number: 2456283,
    gregorian_proleptic: '2012-12-21',
    correlation: 584283,
    provenance: 'attested',
    source: 'Example Author 2012, Example Work, Table 1',
    checked: '2026-09-13',
    notes: '',
    ...overrides,
  };
}

describe('validateRecords', () => {
  it('accepts a fully-populated template record', () => {
    expect(validateRecords([fullRecord()])).to.deep.equal([]);
  });

  it('rejects a record missing provenance', () => {
    const record = fullRecord();
    delete record.provenance;
    expect(validateRecords([record])).to.not.be.empty;
  });

  it('rejects provenance: attested with a missing source', () => {
    const record = fullRecord();
    delete record.source;
    expect(validateRecords([record])).to.not.be.empty;
  });

  it('rejects provenance: attested with an empty source', () => {
    expect(validateRecords([fullRecord({ source: '' })])).to.not.be.empty;
  });

  it('rejects an unknown provenance value', () => {
    expect(validateRecords([fullRecord({ provenance: 'legendary' })])).to.not.be.empty;
  });

  it('rejects a long_count not in positional notation', () => {
    expect(validateRecords([fullRecord({ long_count: 'thirteen baktuns' })])).to.not.be.empty;
    expect(validateRecords([fullRecord({ long_count: '9.16.4.10.x' })])).to.not.be.empty;
    expect(validateRecords([fullRecord({ long_count: '9' })])).to.not.be.empty;
  });

  it('rejects an unknown field, so a misspelled field cannot pass silently', () => {
    expect(validateRecords([fullRecord({ julian_day_numer: 2456283 })])).to.not.be.empty;
  });

  it('errors name the offending record by id', () => {
    const errors = validateRecords([fullRecord({ provenance: 'legendary' })]);
    expect(errors.join('\n')).to.include('era-base');
  });
});

describe('validateFile', () => {
  it('accepts schema/example.yaml', () => {
    const example = path.join(__dirname, '..', 'schema', 'example.yaml');
    expect(validateFile(example)).to.deep.equal([]);
  });
});

describe('npm run validate (CLI)', () => {
  const validateJs = path.join(__dirname, 'validate.js');

  function runCli(args) {
    try {
      execFileSync(process.execPath, [validateJs, ...args], { encoding: 'utf8' });
      return 0;
    } catch (err) {
      return err.status;
    }
  }

  it('exits 0 with no arguments (validates schema/example.yaml)', () => {
    expect(runCli([])).to.equal(0);
  });

  it('exits nonzero on a file with an invalid record', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'maya-fixture-validate-'));
    const bad = path.join(dir, 'bad.yaml');
    writeFileSync(bad, ['- id: no-provenance', '  long_count: "9.16.4.10.8"'].join('\n'));
    try {
      expect(runCli([bad])).to.not.equal(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
