import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intParse, doubleParse, tryParse, csDouble, intDiv } from './cs.ts';

test('int.Parse', () => {
  assert.equal(intParse(' 42 '), 42);
  assert.equal(intParse('-7'), -7);
  assert.throws(() => intParse('hola'), /correct format/);
  assert.throws(() => intParse('3,5'), /correct format/);
  assert.throws(() => intParse('9999999999'), /Int32/);
});

test('double.Parse en es-ES', () => {
  assert.equal(doubleParse('2,5'), 2.5);
  assert.equal(doubleParse('2.5'), 25); // el punto es separador de miles
  assert.equal(doubleParse('1.000,75'), 1000.75);
  assert.throws(() => doubleParse('abc'));
  assert.throws(() => doubleParse(''));
  assert.equal(doubleParse('1,45', 'en'), 145);
  assert.equal(doubleParse('1.45', 'en'), 1.45);
});

test('TryParse no lanza', () => {
  assert.deepEqual(tryParse(intParse, 'x'), [false, 0]);
  assert.deepEqual(tryParse(intParse, '50'), [true, 50]);
});

test('formato y división entera', () => {
  assert.equal(csDouble(12.5), '12,5');
  assert.equal(csDouble(12.5, 'F2'), '12,50');
  assert.equal(csDouble(1 / 3, 'F2'), '0,33');
  assert.equal(intDiv(5, 2), 2);
  assert.equal(intDiv(-7, 2), -3);
  assert.throws(() => intDiv(1, 0), /divide by zero/);
});

import { reproducir, type Programa } from './traza.ts';

test('reproducir: entrada, retroceso y excepción', () => {
  const p: Programa = function* (t) {
    yield t.en(1);
    t.write('Edad: ');
    const s = yield t.leer(2);
    const edad = intParse(s ?? null);
    t.def('edad', 'int', edad);
    yield t.en(3);
    t.writeLine(`Tienes ${edad}`);
  };
  const espera = reproducir(p, 5, []);
  assert.equal(espera.esperando, true);
  const fin = reproducir(p, 5, ['30']);
  assert.equal(fin.fin, 'ok');
  assert.deepEqual(fin.traza.consola.map((l) => l.map((x) => x.texto).join('')), ['Edad: 30', 'Tienes 30']);
  assert.equal(reproducir(p, 1, ['30']).traza.consola.length, 0);
  const mal = reproducir(p, 5, ['hola']);
  assert.equal(mal.fin, 'excepcion');
});
