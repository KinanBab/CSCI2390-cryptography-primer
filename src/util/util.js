function isTypedArray(a) { return !!(a?.buffer instanceof ArrayBuffer && a?.BYTES_PER_ELEMENT); }

function Print() {
  let params = [];
  for (let arg of arguments) {
    if (isTypedArray(arg)) {
      let result = [];
      for (let c of arg) {
        result.push(String.fromCharCode(c));
      }
      params.push(result.join(''));
    } else {
      params.push(arg);
    }
  }

  console.log.apply(null, params);
}


module.exports = {
  Print: Print
};
