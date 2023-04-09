function parseSearch(searchString) {
  let result = {};
  searchString
    .split("?")[1]
    .split("&")
    .forEach((keyValuePair) => {
      let keyValueArr = keyValuePair.split("=");
      result[keyValueArr[0]] = keyValueArr[1];
    });
  return result;
}

export default parseSearch;
