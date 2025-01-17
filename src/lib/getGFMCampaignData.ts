import phantom from "phantom";
import * as cheerio from "cheerio";
import { CAMPAIGNS } from "../consts/campaigns";

export type CampaignData = {
  campaignName: string;
  status: string;
  title: string;
  currentAmount: number;
  goalAmount: number;
  percentage: number;
  fundName: string;
  photo: string;
};

export async function getGFMCampaignData(campaignName: string) {
  const instance = await phantom.create();
  const page = await instance.createPage();
  
  await page.on("onResourceRequested", function (requestData) {
    console.info("Requesting", requestData.url);
  });

  const status = await page.open(`https://www.gofundme.com/f/${campaignName}`);
  const content = await page.property("content");

  await instance.exit();

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
    status,
    title,
    currentAmount,
    goalAmount,
    percentage,
    fundName,
    photo,
  };
}

export async function getAllCampaigns() {
  const campaignDataPromises = CAMPAIGNS.map((campaign) =>
    getGFMCampaignData(campaign)
  );

  const campaignData = await Promise.all(campaignDataPromises).then(
    (data) => data
  );

  return campaignData;
}