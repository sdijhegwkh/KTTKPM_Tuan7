const cache = new Map();

const TTL = 5000; // 5s (flash sale thì ngắn thôi)

function set(key, value) {
  cache.set(key, {
    value,
    expiredAt: Date.now() + TTL,
  });
}

function get(key) {
  const data = cache.get(key);

  if (!data) return null;

  if (Date.now() > data.expiredAt) {
    cache.delete(key);
    return null;
  }

  return data.value;
}

module.exports = { get, set };