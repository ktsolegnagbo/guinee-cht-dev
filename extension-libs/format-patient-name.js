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

const capitalizeNames = (firstName, lastName) => {
  const fName = getStrValue(firstName);
  const lName = getStrValue(lastName);
  const names = `${fName}`.split(` `);
  const capitalizedFirstNames = names.map(
    (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  );
  const formattedFirstNames = capitalizedFirstNames.join(` `);
  const uppercasedLastName = `${lName}`.toUpperCase();
  return `${formattedFirstNames} ${uppercasedLastName}`;
};

module.exports = function (firstname, lastname) {
  return {
    t: `str`,
    v: capitalizeNames(firstname, lastname),
  };
};
