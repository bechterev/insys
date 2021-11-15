module.exports.filter = function filter(s, fields) {
  let arrStr = s
    .split(/\r\n/)
    .filter((el) => /(^-|^\n-)|(^(\/r))|(\n$)/.test(el) == false && el !== "");
  let res = {};

  fields.forEach((val) => {
    const constrain = new RegExp(`${val}`, "i");
    arrStr.map((el, ind) => {
      if (constrain.test(el)) res[val] = arrStr[ind + 1];
      return el;
    });
  });
  return res;
};
