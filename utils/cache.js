const store = new Map();
const defaulttime = 60 * 1000;


// read data from cache
function get(key) {
  // store data in entry
  const entry = store.get(key);
  // if entry is empty return null
  if (!entry) return null;
  // if time will exceedes the set time or expiration time then cach will automatically delete
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  // if above condions are not happened then return the cache data
  return entry.data;
}

// store data with expire timestamp
function set(key, data, expirein = defaulttime) {
  store.set(key, { data, expiresAt: Date.now() + expirein });
}

function del(key) {
  store.delete(key);
}


// it is uses for delete the multiple data or in bulk
function delByPrefix(prefix) {
  for (const k of store.keys()) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}

module.exports = { get, set, del, delByPrefix };
