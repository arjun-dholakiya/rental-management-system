const NodeCache = require('node-cache');
const cache = new NodeCache();

module.exports = {
  save: (email, otp, ttlSeconds) => {
    console.log(`Saving OTP ${otp} for ${email}`);
    cache.set(email, otp, ttlSeconds);
  },
  get: (email) => {
    const value = cache.get(email);
    console.log(`Retrieving OTP for ${email}:`, value);
    return value;
  },
  delete: (email) => {
    console.log(`Deleting OTP for ${email}`);
    cache.del(email);
  }
};
