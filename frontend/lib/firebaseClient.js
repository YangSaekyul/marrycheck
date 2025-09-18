// Compatibility shim for old pages/ code that imports from lib/firebaseClient
// Re-export the auth object from the TypeScript firebase module.

const mod = require('./firebase')

// firebase.ts exports named exports; in compiled JS it's available via .auth
exports.auth = mod.auth || mod.default?.auth
