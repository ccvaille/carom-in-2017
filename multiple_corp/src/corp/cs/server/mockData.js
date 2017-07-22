const faker = require('faker');

// faker.locale = 'zh_CN';

function generateCsGroups(total) {
    const data = [];

    for (let i = 0; i < total; i++) {
        const title = faker.lorem.word();
        const id = faker.random.number();

        data.push({
            id,
            title,
        });
    }

    return data;
}

function generateData(total) {
    const csGroups = generateCsGroups(total);

    return {
        csGroups,
    };
}

// const data = generateData;
// console.log(JSON.stringify(data));
module.exports = generateData;
