// src/data/modules.js
// Central registry of all training modules.
// status: 'live' | 'soon' | 'beta'

export const MODULES = [
  {
    id:          'healthcare-cpr',
    title:       'Healthcare & First Aid',
    icon:        '🏥',
    description: 'Master CPR, emergency response, and BLS procedures through a fully immersive hospital simulation.',
    tags:        ['WebXR', 'Beginner–Pro', '9 Steps', 'Live'],
    tagColors:   ['tc', 'ta', 'tg', 'tr'],
    status:      'live',
    iconBg:      'rgba(255,23,68,.12)',
    iconColor:   'var(--red)',
    stepsFile:   'healthcare',
  },
  {
    id:          'renewable-energy',
    title:       'Renewable Energy',
    icon:        '☀️',
    description: 'Solar panel installation, wind turbine maintenance and high-voltage safety protocols.',
    tags:        ['Coming Soon'],
    tagColors:   ['tc'],
    status:      'soon',
    iconBg:      'rgba(255,215,0,.1)',
    iconColor:   'var(--gold)',
  },
  {
    id:          'manufacturing',
    title:       'Advanced Manufacturing',
    icon:        '⚙️',
    description: 'CNC operations, quality control, and Industry 4.0 assembly line procedures.',
    tags:        ['Coming Soon'],
    tagColors:   ['tc'],
    status:      'soon',
    iconBg:      'rgba(0,229,255,.08)',
    iconColor:   'var(--cyan)',
  },
  {
    id:          'construction',
    title:       'Construction & Safety',
    icon:        '🏗️',
    description: 'Scaffolding, electrical wiring, plumbing and worksite compliance training.',
    tags:        ['Coming Soon'],
    tagColors:   ['tc'],
    status:      'soon',
    iconBg:      'rgba(0,191,165,.1)',
    iconColor:   'var(--teal)',
  },
];