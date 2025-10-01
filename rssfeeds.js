const fs = require("fs");

const token = process.env.RSS_TOKEN;
async function fetchRSSFeeds() {

	const since = new Date();
	since.setDate(since.getDate() - 3);

	const url = "https://feed.teukka.synology.me/v1/feeds";

	const response = await fetch(url, {
		headers: {
			"X-Auth-Token": token,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

fetchRSSFeeds().then((res) => {
	Promise.all(
		res.map(async ({ title, site_url, id }) => {
			const icon = await fetch(
				`https://feed.teukka.synology.me/v1/feeds/${id}/icon`,
		{ headers: {
			"X-Auth-Token": token,
		}, }
			);
      let data = ""
      if (icon.ok) {
        res = await icon.json();
        data = res.data;
      }
			return {
				title,
				site_url,
				imgData: data,
			};
		}),
	).then((feeds) => {
		fs.writeFileSync("./data/rssfeeds/list.json", JSON.stringify(feeds));
	});
});
