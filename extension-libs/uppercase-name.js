const getValue = function (obj) {
  let val;
  if (obj.t === "arr") {
    val = obj.v && obj.v.length && obj.v[0];
  } else {
    val = obj.v;
  }
  return val;
};
const getStrValue = function (obj) {
  val = getValue(obj);
  if (!val) {
    return null;
  }
  return val.textContent;
};

const capitalizeName = (name) => {
  const names = getStrValue(name);
  return `${names}`.toUpperCase();
};

module.exports = function (name) {
  return {
    t: `str`,
    v: capitalizeName(name),
  };
};
