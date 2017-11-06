const looksSame = require('looks-same');

looksSame('AU.png', 'NZ.png', function(error, equal) {
  if (equal === false) {
    looksSame.createDiff(
      {
        reference: 'AU.png',
        current: 'NZ.png',
        diff: 'diff.png',
        highlightColor: '#ff00ff', //color to highlight the differences
        strict: false, //strict comparsion
        tolerance: 2.5
      },
      function(error) {}
    );
  }
});
