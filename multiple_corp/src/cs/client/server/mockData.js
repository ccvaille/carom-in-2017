const faker = require('faker');

// faker.locale = 'zh_CN';

function generateVisitors(total) {
    const data = [];

    for (let i = 0; i < total; i++) {
        const avatar = faker.image.avatar();
        const userName = faker.internet.userName();
        const visitTime = faker.date.past();
        const source = faker.lorem.word();
        const landingPage = faker.internet.url();
        const status = faker.random.number();
        const customer = faker.internet.userName();

        data.push({
            id: i,
            avatar,
            user_name: userName,
            visit_time: visitTime,
            source,
            landing_page: landingPage,
            status,
            customer,
        });
    }

    return data;
}

function generateHistory(total) {
    const data = [];

    for (let i = 0; i < total; i++) {
        const csAvatar = faker.image.avatar();
        const csName = faker.internet.userName();
        const startTime = faker.date.past();
        const visitorName = faker.internet.userName();
        const district = faker.address.city();
        const source = faker.lorem.word();
        const firstResponse = faker.random.number();
        const conversationTime = faker.random.number();

        data.push({
            id: i,
            kf_avatar: csAvatar,
            kf_name: csName,
            start_time: startTime,
            visitor_name: visitorName,
            district,
            source,
            first_response: firstResponse,
            conversation_time: conversationTime,
        });
    }

    return data;
}

function generateTrackWayHistory(total) {
    const data = [];
    for (let i = 0; i < total; i ++) {
        const csVisitTime = faker.date.past();
        const csVisitPage = faker.internet.url();
        const csVisitWebName = faker.internet.userName();
        const csVisitDelay = faker.random.number();
        data.push({
            id: i,
            visit_time: csVisitTime,
            visit_web_name: csVisitWebName,
            visit_page: csVisitPage,
            visit_delay: csVisitDelay,
        });
    }
    return data;
}

function generateChatHistory(total) {
    const data = [];
    const typeArr = ['TIP_MSG', 'CS_TIP_MSG', 'SESSION_MSG'];
    const fromIdArr = [0, 1];

    for (let i = 0; i < total; i++) {
        const type = typeArr[Math.round(Math.random())];
        const formId = fromIdArr[Math.round(Math.random())];
        const msgTime = faker.date.past();
        const msgContent = faker.lorem.word();
        const msgId = faker.random.number();

        data.push({
            id: i,
            type,
            formId,
            msgTime,
            msgContent,
            msgId,
        });
    }

    return data;
}

function generateDashboardCsStats(total) {
    const data = [];

    for (let i = 0; i < total; i++) {
        const csAvatar = faker.image.avatar();
        const csName = faker.internet.userName();
        const receiveCount = faker.random.number();
        const messageCount = faker.random.number();
        const averageTime = faker.random.number();
        const firstResponse = faker.random.number();

        data.push({
            id: i,
            kf_avatar: csAvatar,
            kf_name: csName,
            receive_count: receiveCount,
            message_count: messageCount,
            first_response: firstResponse,
            average_time: averageTime,
        });
    }

    return data;
}

function generateOverview() {
    const data = [{
        visitors_count: faker.random.number(),
        in_storage_count: faker.random.number(),
        advise_count: faker.random.number(),
        receive_count: faker.random.number(),
        receive_percent: faker.random.number(),
    }];

    return data;
}

function generateReplyGroups(total) {
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
    const visitors = generateVisitors(total);
    const history = generateHistory(total);
    const dashboardCsStats = generateDashboardCsStats(total);
    const overview = generateOverview();
    const replyGroups = generateReplyGroups(total);
    const trackList = generateTrackWayHistory(total);
    const chatList = generateChatHistory(total);

    return {
        visitors,
        history,
        dashboardCsStats,
        overview,
        replyGroups,
        trackList,
        chatList,
    };
}

// const data = generateData;
// console.log(JSON.stringify(data));
module.exports = generateData;
