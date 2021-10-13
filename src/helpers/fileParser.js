const reader = require("xlsx");

module.exports = {
  fileParser(fileUrl) {
    try {
      const file = reader.readFile(fileUrl);
      let data = [];
      const sheets = file.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        temp.forEach((res) => {
          data.push(res);
        });
      }
      return { data };
    } catch (err) {
      return { error: err };
    }
  },
};
