rollup({
  entry: 'assets/js/main.js',
  plugins: [
    babel({
      presets: [
        [
          "es2015", {
            "modules": false
          }
        ]
      ],
      babelrc: false,
      exclude: 'node_modules/**'
    })
  ]
});