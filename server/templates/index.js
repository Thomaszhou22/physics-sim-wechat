const projectile = require('./mechanics/projectile-motion');
const pendulum = require('./mechanics/pendulum');
const spring = require('./mechanics/spring-oscillator');
const collision = require('./mechanics/collision');
const incline = require('./mechanics/incline');
const freeFall = require('./mechanics/free-fall');
const circular = require('./mechanics/circular-motion');
const circuit = require('./electromagnetism/circuit');
const waveInterference = require('./waves/wave-interference');
const lens = require('./optics/lens');

module.exports = {
  'projectile-motion': projectile,
  'pendulum': pendulum,
  'spring-oscillator': spring,
  'collision': collision,
  'incline': incline,
  'free-fall': freeFall,
  'circular-motion': circular,
  'circuit': circuit,
  'wave-interference': waveInterference,
  'lens': lens,
};
