import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const code = readFileSync(new URL('../scripts/contact.js', import.meta.url), 'utf8');

function setup({ phone = '+51 936 872 862', notes = 'Una fuga debajo del lavatorio.', query = '?service=griferias' } = {}) {
  const fields = Object.fromEntries(Object.entries({
    fullname: '  Cliente de prueba  ', phone, district: 'Nuevo Chimbote', notes,
    urgency: 'Urgente', preferredDate: '2026-12-20', service: '',
  }).map(([key, value]) => [key, { value, validityMessage: '', setCustomValidity(message) { this.validityMessage = message; } }]));
  fields.service.options = [{ value: '' }, { value: 'griferias' }, { value: 'otro' }];
  fields.service.selectedOptions = [{ textContent: 'Instalación y reparación de griferías' }];
  fields.service.addEventListener = fields.urgency.addEventListener = () => {};
  const events = {};
  const button = { disabled: true };
  const form = {
    elements: { namedItem: name => fields[name] },
    querySelector: () => button,
    addEventListener: (name, handler) => events[name] = handler,
    reportValidity: () => Object.values(fields).every(field => !field.validityMessage),
  };
  const elements = { '#request-form': form, '#service': fields.service, '#urgency': fields.urgency, '#preferredDate': fields.preferredDate, '#form-status': {}, '#service-note': {}, '#urgency-note': {} };
  let destination;
  runInNewContext(code, {
    document: { querySelector: selector => elements[selector] },
    localStorage: { removeItem() { throw new Error('Storage unavailable'); } },
    location: { search: query },
    window: { location: { assign: url => destination = url } },
    FormData: class { *[Symbol.iterator]() { for (const [key, field] of Object.entries(fields)) yield [key, field.value]; } },
    URLSearchParams, Intl, Date, encodeURIComponent,
  });
  return { fields, button, submit() { events.submit({ preventDefault() {} }); return destination; } };
}

test('preselects service and prepares every field without requiring browser storage', () => {
  const form = setup();
  assert.equal(form.fields.service.value, 'griferias');
  assert.equal(form.button.disabled, false);
  const url = new URL(form.submit());
  assert.equal(url.origin + url.pathname, 'https://wa.me/51936872862');
  const message = url.searchParams.get('text');
  for (const expected of ['Cliente de prueba', 'Instalación y reparación de griferías', 'Una fuga debajo del lavatorio.', 'Nuevo Chimbote', 'Urgente', '2026-12-20', '+51 936 872 862']) assert.ok(message.includes(expected), expected);
  assert.ok(!message.includes('  Cliente'));
});
test('invalid telephone never opens WhatsApp', () => {
  assert.equal(setup({ phone: 'abcdefghi' }).submit(), undefined);
  assert.equal(setup({ phone: '12345678' }).submit(), undefined);
});
test('blank or short details cannot be padded with spaces', () => {
  assert.equal(setup({ notes: '               ' }).submit(), undefined);
  assert.equal(setup({ notes: '       fuga       ' }).submit(), undefined);
});
test('unknown service in a URL leaves the selector unchanged', () => {
  assert.equal(setup({ query: '?service=does-not-exist' }).fields.service.value, '');
});
