//last-household-code.js
// import { lastFamilyCode } from `../contact-summary.templated`;

function notNull(data) {
  const isEmpty = Array.isArray(data) ? data.length === 0 : false;
  return (
    data !== null &&
    data !== `` &&
    data !== undefined &&
    typeof data !== undefined &&
    isEmpty === false
  );
}
// async function openDatabase(dbName) {
//     const dbName =
//     const request = indexedDB.open(dbName, this.dbVersion);
//     const objectStoreNames = `by-sequence`;
//     return new Promise<IDBDatabase>((resolve, reject) => {
//       request.onerror = (event) => {
//         reject(`Error opening IndexedDB '${dbName}'`);
//       };
//       request.onupgradeneeded = (event) => {
//         const db = request.result;
//         if (!db.objectStoreNames.contains(objectStoreNames)) {
//           const objectStore = db.createObjectStore(objectStoreNames, { keyPath: `_doc_id_rev`, autoIncrement: false });
//           objectStore.createIndex(`_doc_id_rev`, { unique: true });
//         }
//       };
//       request.onsuccess = (event) => {
//         resolve((event.target).result);
//       };
//     });
//   }

// Function to set the value of an input element by its name attribute
function setValueByName(name, value) {
  // Select the input element with the given name
  const inputElement = document.querySelector(`input[name="${name}"]`);

  // If the element is found, set its value
  if (inputElement) {
    inputElement.value = value;
  } else {
    console.log(`Element with name "${name}" not found.`);
  }
}

const feedbackDocsReadScript = async (done) => {
  // This is running inside the browser. indexedDB is available there.
  const allDbList = await indexedDB.databases();
  const metaDbList = allDbList.filter((db) => db.name === "_pouch_medic-user-kossi");
  const feedbackDocs = {};
  for (const metaDbName of metaDbList) {
    const nameStripped = metaDbName.name.replace("_pouch_", "");
    const metaDb = new PouchDB(nameStripped);
    const result = await metaDb.allDocs({
      include_docs: true,
    });
    feedbackDocs[nameStripped] = result.rows;
  }
  done(feedbackDocs);
  // #########################################
  // const options = { include_docs: true };
  // window.CHTCore.DB.get()
  //   .allDocs(options)
  //   .then(result => {
  //     result.rows
  //     done()
  //   });
};

function getLastHouseHoldCode(done) {
  window.CHTCore.DB.get()
    .allDocs({ include_docs: true })
    .then((result) => {
      const rows = result.rows.filter(row => {
        return row.doc && row.doc.type === `clinic` && notNull(row.doc.family_number) && parseInt(row.doc.family_number) > 0;
      });
      if (rows.length > 0) {
        const maxVal = Math.max(...rows.map(r => parseInt(r.doc.family_number)));
        done(maxVal + 1);
      } else {
        done(1);
      }
    });


    // expect(db.medic.allDocs.args).to.deep.equal([[{
    //   startkey: 'form:',
    //   endkey: 'form:\ufff0',
    //   include_docs: true,
    //   attachments: true,
    //   binary: true,
    // }]]);
}

module.exports = function (val) {
    const lastFamilyCode = getLastHouseHoldCode();
    return {
      t: `str`,
      v: lastFamilyCode,
    };
};
