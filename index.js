const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");

const JAKSO_PODCASTS_URL = "https://jakso.fi/podcastit";

const run = async () => {
  const res = await fetch(JAKSO_PODCASTS_URL);
  if (res.status !== 200) {
    throw new Error("Failed to fetch HTML from URL " + JAKSO_PODCASTS_URL);
  }
  const html = await res.text();
  const dom = new JSDOM(html);
  const data = [];

  dom.window.document
    .querySelectorAll("article > .entry-content > p")
    .forEach((node, i) => {
      // Ignore first item
      if (i === 0) {
        return;
      }
      data.push({
        title: node.children[1]?.innerHTML,
        feedUrl: node.children[2]?.href,
        iTunesUrl: node.children[3]?.href,
      });
    });

  const json = JSON.stringify(data, null, 2);
  await fs.writeFile("data.json", json);
};

run();
