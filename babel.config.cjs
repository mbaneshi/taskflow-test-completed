/* eslint-env node */
module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'auto' // Let Babel decide based on environment
    }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: 'commonjs' // Force CommonJS for Jest compatibility
        }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }
  }
};
