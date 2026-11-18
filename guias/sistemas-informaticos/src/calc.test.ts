import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ddr, frecuencia, fuente, latenciaNs, leerCPU, planVM } from './calc.ts';

test('frecuencia = base × multiplicador (quiz de clase: 800 MHz × 3 = 2,4 GHz)', () => {
  assert.equal(frecuencia(800, 3), 2.4);
  assert.equal(frecuencia(100, 36), 3.6);
});

test('nombres DDR', () => {
  assert.deepEqual(ddr(4, 3200), { chip: 'DDR4-3200', modulo: 'PC4-25600', mbs: 25600, relojMHz: 1600 });
  assert.equal(ddr(1, 400).modulo, 'PC3200');
  assert.equal(ddr(3, 1600).modulo, 'PC3-12800');
  assert.equal(latenciaNs(16, 3200), 10);
});

test('fuente con margen y tamaño comercial', () => {
  assert.deepEqual(fuente([125, 200, 60, 15], 0.15), { total: 400, minimo: 460, comercial: 500 });
});

test('plan de máquinas virtuales', () => {
  const h = { ramGB: 16, hilos: 8, discoGB: 200 };
  assert.equal(planVM(h, [{ nombre: 'Ubuntu', ramGB: 4, cpus: 2, discoGB: 25 }]).avisos.length, 0);
  const r = planVM(h, [{ nombre: 'W11', ramGB: 8, cpus: 6, discoGB: 64 }, { nombre: 'Ubuntu', ramGB: 6, cpus: 2, discoGB: 25 }]);
  assert.equal(r.avisos.length, 2);
});

test('leer nombres de CPU', () => {
  assert.deepEqual(leerCPU('Core i7-14700K'), { marca: 'Intel', gama: 'i7', generacion: 14, modelo: '700', sufijo: 'K', significa: 'multiplicador desbloqueado: admite overclocking' });
  assert.equal(leerCPU('Intel Core i5-9400F')?.generacion, 9);
  assert.equal(leerCPU('Ryzen 7 7800X3D')?.sufijo, 'X3D');
  assert.equal(leerCPU('Pentium 4'), null);
});
