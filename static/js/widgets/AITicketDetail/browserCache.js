function setCache(key, value) {
  window.localStorage.setItem(key, value);
}
function getCache(key) {
  return window.localStorage.getItem(key);
}

export { setCache, getCache };
