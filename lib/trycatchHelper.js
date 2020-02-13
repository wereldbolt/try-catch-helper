let _logger;
const _ = require('lodash');
const pe = require('parse-error');

/**
 * Dependencies:
 * Lodash
 * Parse error
 *
 * Module usage:
 * Expects logger object with error method.
 *
 * Example usage:
 * const {to, TE, go} = require('try-catch-helper')(logger);
 *
 */


/**
 *
 * Returns result as tuple<error, result>.
 *
 *  Example usage:
 *  [err, result] = await to(promise);
 *
 * @param promise
 * @returns parsed error
 */
const to = function (promise) {
    return promise
        .then(data => [null, data]).catch(err => {
            _logger.error(pe(err));
            return [pe(err)];
        });
};

/**
 * Throws error based on string.
 *
 * Example usage:
 * if (err) TE('Something went wrong);
 *
 * @param err_message
 * @param error_status_code
 * @param shouldLog
 * @constructor
 */
const TE = function (err_message, error_status_code, shouldLog) { // TE stands for Throw Error
    if (shouldLog === true) {
        const log_err_message = _.isString(err_message) ? err_message : pe(err_message);
        _logger.error(log_err_message + ` on line ${err_message.line} of file: ${err_message.filename}`);
    }
    if (err_message.message) {
        throw new Error(err_message.message);
    } else {
        throw new Error(err_message);
    }
};

/**
 * Combines to and TE helper.
 *
 * Example usage:
 *
 * return go(asyncFunc());
 *
 *
 * @param promise
 * @param errorMessage
 * @param shouldLog
 * @returns {Promise<*>}
 */
const go = async function (promise, errorMessage, shouldLog) {
    let err, model;
    [err, model] = await to(promise);
    if (err && shouldLog) {
        _logger.error(err.message);
    }
    if (err) TE(errorMessage ? errorMessage : err.message, null, shouldLog);
    return model;
};

module.exports = (logger) => {
    _logger = logger;
    return {pe, to, TE, go}
};
