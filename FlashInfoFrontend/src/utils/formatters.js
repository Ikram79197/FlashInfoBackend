import React from 'react';

// Utilitaires partagés pour le formatage des nombres, pourcentages et badges d'évolution
export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '0';

  // If already a number, format directly
  if (typeof value === 'number') {
    return Math.round(value).toLocaleString('fr-FR').replace(/\u202F|\u00A0|,/g, ' ');
  }

  let s = String(value).trim();
  // Normalize non-breaking spaces
  s = s.replace(/\u00A0|\u202F/g, ' ');

  // Remove percentage sign or other non-number suffixes
  s = s.replace(/%/g, '').trim();

  // Handle cases like "1,166,077 00" (space + 2 digits at end -> cents)
  // Do this BEFORE assuming the last comma/dot is a decimal separator.
  const trailingCents = s.match(/^(.*)\s(\d{2})$/);
  if (trailingCents) {
    const intPartRaw = trailingCents[1];
    const decPart = trailingCents[2];
    const intDigits = intPartRaw.replace(/[^0-9]/g, '');
    const num = parseFloat(intDigits + '.' + decPart);
    if (!isNaN(num)) return Math.round(num).toLocaleString('fr-FR').replace(/\u202F|\u00A0|,/g, ' ');
  }

  // If string contains at least one comma or dot, try to detect decimal separator.
  if (/[.,]/.test(s)) {
    // Find last occurrence of dot or comma - assume it's decimal separator
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    const lastSepIndex = Math.max(lastComma, lastDot);

    if (lastSepIndex > -1) {
      const intPartRaw = s.slice(0, lastSepIndex);
      const decPartRaw = s.slice(lastSepIndex + 1);

      // If the supposed decimal part still contains spaces or more separators,
      // it's likely the last separator was a thousands separator -> skip this branch.
      if (/\s|[.,]/.test(decPartRaw)) {
        // fall through to a more permissive fallback below
      } else {
        const intDigits = intPartRaw.replace(/[^0-9]/g, '');
        const decDigits = decPartRaw.replace(/[^0-9]/g, '');
        const normalized = intDigits + (decDigits ? '.' + decDigits : '');
        const num = parseFloat(normalized);
        if (!isNaN(num)) return Math.round(num).toLocaleString('fr-FR').replace(/\u202F|\u00A0|,/g, ' ');
      }
    }
  }

  // Fallback: remove all non-digit characters and parse
  const digitsOnly = s.replace(/[^0-9]/g, '');
  if (!digitsOnly) return '0';
  const fallbackNum = parseFloat(digitsOnly);
  if (isNaN(fallbackNum)) return '0';
  return Math.round(fallbackNum).toLocaleString('fr-FR').replace(/\u202F|\u00A0|,/g, ' ');
}

export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || value === '') return '0,00 %';
  const num = typeof value === 'string' ? parseFloat(value.toString().replace(/\s/g, '').replace(',', '.').replace('%', '')) : Number(value);
  if (isNaN(num)) return '0,00 %';
  // use comma as decimal separator
  return num.toFixed(decimals).replace('.', ',') + ' %';
}

export function getEvolutionClass(value) {
  if (value === '' || value == null) return 'evo-gray';
  try {
    let numStr = value.toString().trim();
    numStr = numStr.replace(/\s+/g, '');
    numStr = numStr.replace('%', '');
    numStr = numStr.replace(',', '.');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 'evo-gray';
    if (num < 0) return 'evo-red';
    if (num < 5) return 'evo-orange';
    if (num < 100) return 'evo-green';
    return 'evo-green-dark';
  } catch (e) {
    console.error('getEvolutionClass error', e, value);
    return 'evo-gray';
  }
}

// Petite composante réutilisable pour afficher un badge d'évolution
export function EvolutionBadge({ value }) {
  const cls = getEvolutionClass(value);
  return React.createElement('span', { className: `evo-badge ${cls}` }, value ?? '');
}
