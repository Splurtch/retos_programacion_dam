import { test } from 'node:test';
import assert from 'node:assert/strict';
import { admite, comprobarReto, texto, tipo } from './er.ts';

test('tipo por máximos', () => {
  assert.equal(tipo(1, 1), '1:1');
  assert.equal(tipo(1, 'N'), '1:N');
  assert.equal(tipo('N', 1), '1:N');
  assert.equal(tipo('N', 'N'), 'N:M');
});

test('texto y admite', () => {
  assert.equal(texto({ min: 0, max: 'N' }), '(0,n)');
  assert.ok(admite({ min: 0, max: 1 }, 0));
  assert.ok(!admite({ min: 1, max: 1 }, 2));
});

test('el modelo correcto del reto pasa las cuatro comprobaciones', () => {
  const r = comprobarReto({ min: 1, max: 1 }, { min: 0, max: 'N' });
  assert.deepEqual(r, { inicial: true, vacia: true, unaPorProducto: true, sinHuerfanos: true });
});

test('los errores típicos fallan donde deben', () => {
  // Paréntesis cambiados de lado.
  assert.equal(comprobarReto({ min: 0, max: 'N' }, { min: 1, max: 1 }).inicial, false);
  // Mínimo 1 en productos: no admite la categoría vacía.
  assert.equal(comprobarReto({ min: 1, max: 1 }, { min: 1, max: 'N' }).vacia, false);
  // N:M: un producto podría estar en dos categorías.
  assert.equal(comprobarReto({ min: 1, max: 'N' }, { min: 0, max: 'N' }).unaPorProducto, false);
});
