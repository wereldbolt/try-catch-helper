const assert = require('assert');

const log = (m) => process.stdout.write(m);
const error = (e) => log(e.message);

const {go, TE, to} = require('../lib/main')({log: log, error: error});

const success = async function(resolve) {
    return to(new Promise(resolve => resolve('success')));
};

const fail = async (reject) => await to(new Promise(reject => reject('fail')));

(async() => {
    log('\n1. Check "to" helper\n');
    const [err, r] = await success();
    assert.equal(err, null);
    assert.equal(r, 'success');
})();
