const faker = require('faker');

/**
 * Generate List of Fake Data by defined Scema and Return it
 * @param {number} count
 * @param {Object} schema
 */
const generateFakeDataListByCount = (count, schema) => {
  const fakedata = [];
  for (let i = 0; i < count; i += 1) {
    const dataObj = { id: `${i + 1}` };
    schema.forEach((item) => {
      switch (item.type) {
        case 'Faker.js':
          dataObj[item.name] = faker.fake(`{{${item.fakerMethod}}}`);
          break;
        case 'String':
          dataObj[item.name] = faker.datatype.string();
          break;
        case 'Number':
          dataObj[item.name] = faker.datatype.number();
          break;
        case 'Boolean':
          dataObj[item.name] = faker.datatype.boolean();
          break;
        case 'Object':
          dataObj[item.name] = {};
          break;
        case 'Array':
          dataObj[item.name] = [];
          break;
        case 'Date':
          dataObj[item.name] = faker.date.past(1, new Date()).getTime();
          break;
        default:
          break;
      }
    });
    fakedata.push(dataObj);
  }
  return fakedata;
};

/**
 * Generate Single object of Fake Data by defined Scema and Return it
 * @param {number} currentSize
 * @param {Object} schema
 */
const generateFakeDataObject = (currentSize, schema) => {
  const dataObj = { id: `${currentSize + 1}` };
  schema.forEach((item) => {
    switch (item.type) {
      case 'Faker.js':
        dataObj[item.name] = faker.fake(`{{${item.fakerMethod}}}`);
        break;
      case 'String':
        dataObj[item.name] = faker.datatype.string();
        break;
      case 'Number':
        dataObj[item.name] = faker.datatype.number();
        break;
      case 'Boolean':
        dataObj[item.name] = faker.datatype.boolean();
        break;
      case 'Object':
        dataObj[item.name] = {};
        break;
      case 'Array':
        dataObj[item.name] = [];
        break;
      case 'Date':
        dataObj[item.name] = faker.date.past(1, new Date()).getTime();
        break;
      default:
        break;
    }
  });
  return dataObj;
};

module.exports = { generateFakeDataListByCount, generateFakeDataObject };
