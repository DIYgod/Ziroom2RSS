var logger = require('../tools/logger');
var request = require('request');
var url = require('url');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var query = url.parse(req.url, true).query;
    var city = query.city || 'sh';
    var keyword = query.keyword || '';
    var iswhole = query.iswhole || 0;
    var room = query.room || 1;
    var domain = `${city === 'bj' ? '' : city + '.'}m.ziroom.com`;

    logger.info(`Ziroom2RSS room keyword ${keyword}, IP: ${ip}`);

    request.post({
        url: `http://${domain}/list/ajax-get-data`,
        headers: {
            'Host': 'sh.m.ziroom.com',
            'Origin': `http://${domain}`,
            'Referer': `http://${domain}/${city.toUpperCase()}/search.html`,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
        },
        form: {
            'recent_money': 0,
            'sort': 0,
            'is_whole': iswhole,
            'room': room,
            'key_word': keyword,
            'step': 0
        }
    }, function (err, httpResponse, body) {
        var data;
        try {
            data = JSON.parse(body).data;
        }
        catch(e) {
            data = [];
        }
        var list = data;
        var rss =
            `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
        <channel>
        <title>自如的${keyword}${iswhole ? '整租' : '合租'}${room}室房源</title>
        <link>http://${domain}</link>
        <description>自如的${keyword}${iswhole ? '整租' : '合租'}${room}室房源 - 使用 Ziroom2RSS(https://github.com/DIYgod/Ziroom2RSS) 构建</description>
        <language>zh-cn</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <ttl>300</ttl>`
        for (var i = 0; i < list.length; i++) {
            rss += `
        <item>
            <title><![CDATA[第${list[i].title}]]></title>
            <description><![CDATA[${list[i].room_name}<img referrerpolicy="no-referrer" src="${list[i].list_img}">]]></description>
            <guid>http://${domain}/${city.toUpperCase()}/room/${list[i].id}.html</guid>
            <link>http://${domain}/${city.toUpperCase()}/room/${list[i].id}.html</link>
        </item>`
        }
        rss += `
        </channel>
        </rss>`
        res.send(rss);
    });
};