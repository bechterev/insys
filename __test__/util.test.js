const util = require("../util");

const fildsBody = ["fio", "id", "birthday", "gender"];
const listOfChecks = new Map([
  [
    `----------------------------085794239447118788966568\r\n
Content-Disposition: form-data; name="gerder"\r\n
\r
false\r\n
----------------------------085794239447118788966568\r\n
Content-Disposition: form-data; name="id"\r\n
\r
2\r\n
----------------------------085794239447118788966568\r\n
Content-Disposition: form-data; name="fio"\r\n
\r
Elza Potaki\r\n
----------------------------085794239447118788966568\r\n
Content-Disposition: form-data; name="birthday"\r\n
\r
1999-11-06\r\n
----------------------------085794239447118788966568--\r\n`,
    { fio: "Elza Potaki", id: "2", birthday: "1999-11-06" },
  ],
  [
    `----------------------------681526273139884959757642\r\n
Content-Disposition: form-data; name="gerder"\r\n
\r
false\r\n
----------------------------681526273139884959757642\r\n
Content-Disposition: form-data; name="id"\r\n
\r
4\r\n
----------------------------681526273139884959757642\r\n
Content-Disposition: form-data; name="birthday"\r\n
\r
1999-11-06\r\n
 ----------------------------681526273139884959757642--\r\n`,
    { id: "4", birthday: "1999-11-06" },
  ],
  [
    `----------------------------795532722312056876710849\r\n
Content-Disposition: form-data; name="gerder"\r\n
\r
false\r\n
----------------------------795532722312056876710849\r\n
Content-Disposition: form-data; name="birthday"\r\n
\r
1999-11-06\r\n
----------------------------795532722312056876710849--\r\n`,
    { birthday: "1999-11-06" },
  ],
]);
let countTest = 0;
listOfChecks.forEach((value, key) => {
  test(`Test number ${countTest}`, () => {
    expect(JSON.stringify(util.filter(key, fildsBody))).toEqual(
      JSON.stringify(value)
    );
  });
});
