import puppeteer from "puppeteer-core";
import * as cheerio from "cheerio";
import { CAMPAIGNS } from "../consts/campaigns";

export type CampaignData = {
  campaignName: string;
  title: string;
  currentAmount: number;
  goalAmount: number;
  percentage: number;
  fundName: string;
  photo: string;
} | null;

export async function getGFMCampaignData(campaignName: string) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  });
  

  try {
    const page = await browser.newPage();

    await page.goto(`https://www.gofundme.com/f/${campaignName}`);
    const content = await page.content();
    
    const $ = cheerio.load(content);
    const title = $("title").text();
    const nextData = $("#__NEXT_DATA__").html();

    const parsedData =
      nextData && JSON.parse(nextData)["props"]["pageProps"]["__APOLLO_STATE__"];

    const fundraiserData = Object.keys(parsedData).reduce((acc, key) => {
      if (key.startsWith("Fundraiser")) {
        // @ts-expect-error: we don't have the types
        acc[key] = parsedData[key];
      }
      return acc;
    }, {});

    // Fundraiser Data
    const firstFundraiserKey = Object.keys(fundraiserData)[0];
    const parsedFundraiserData =
      fundraiserData[firstFundraiserKey as keyof typeof fundraiserData];

    const currentAmount = parsedFundraiserData["currentAmount"]["amount"];
    const goalAmount = parsedFundraiserData["goalAmount"]["amount"];
    const percentage = Number(((currentAmount / goalAmount) * 100).toFixed(2));
    const photo = parsedFundraiserData["fundraiserImageUrl"];
    const fundName = parsedFundraiserData["fundName"];

    return {
      campaignName,
      title,
      currentAmount,
      goalAmount,
      percentage,
      fundName,
      photo,
    };
  } catch {
    // console.error(e);
    return {
      campaignName,
      title: "",
      currentAmount: 0,
      goalAmount: 0,
      percentage: 0,
      fundName: "",
      photo: "",
    }
  }
}

export async function getAllCampaigns() {
  const campaignDataPromises = CAMPAIGNS.map((campaign) =>
    getGFMCampaignData(campaign)
  );

  const campaignData = await Promise.all(campaignDataPromises).then(
    (data) => data
  );

  return campaignData.filter((campaign) => !!campaign);
}
