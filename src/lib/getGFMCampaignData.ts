import * as cheerio from "cheerio";
import { INDIVIDUAL_AID, CampaignData } from "../consts/campaigns";
import { gfmUrlToId } from "./parseAidCSV";

export type CampaignDataWithFunding = {
  success: boolean;
  photo: string;
  fundName: string;
  fundingData: {
    currentAmount: {
      raw: number;
      formatted: string;
    };
    goalAmount: {
      raw: number;
      formatted: string;
    };
    percentage: number;
  };
} & CampaignData;

export async function getGFMCampaignData(id: string) {
  const uri = `https://www.gofundme.com/f/${id}`;

  const dataFromCsv = INDIVIDUAL_AID.goFundMe.find(
    (aid) => gfmUrlToId(aid.link) === id
  ) as CampaignData;

  // As long as GFM use's next js server rendering then we can scrape the data from the page
  const content = await fetch(uri).then((res) => res.text());
  const $ = cheerio.load(content);

  // Godundme's front end is built with next js so has a __NEXT_DATA__ script tag containing the page props:
  // https://github.com/vercel/next.js/discussions/15117
  let parsedData = null;

  try {
    const nextData = $("#__NEXT_DATA__").html();
    parsedData =
      nextData &&
      JSON.parse(nextData)["props"]["pageProps"]["__APOLLO_STATE__"];
  } catch (e) {
    console.error(e);
  }

  if (!parsedData) {
    return {
      success: false,
      photo: "",
      fundName: "",
      ...dataFromCsv,
      fundingData: {
        currentAmount: {
          raw: 0,
          formatted: "$0",
        },
        goalAmount: {
          raw: 0,
          formatted: "$0",
        },
        percentage: 0,
      },
    };
  }

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

  // Aid amount
  const currentAmount: number = parsedFundraiserData["currentAmount"]["amount"];
  const goalAmount: number = parsedFundraiserData["goalAmount"]["amount"];
  const percentage: number = Number(
    ((currentAmount / goalAmount) * 100).toFixed(2)
  );
  const photo = parsedFundraiserData["fundraiserImageUrl"];
  const fundName = parsedFundraiserData["fundName"];

  return {
    success: true,
    ...dataFromCsv,
    photo,
    fundName,
    fundingData: {
      currentAmount: {
        raw: currentAmount,
        formatted: `$${currentAmount.toLocaleString()}`,
      },
      goalAmount: {
        raw: goalAmount,
        formatted: `$${goalAmount.toLocaleString()}`,
      },
      percentage,
    },
  };
}

export async function getAllCampaigns(page?: number) {
  // 58 go fundm me campaigns - 1 page = 5 campaigns
  const campaignSegments = () => {
    if (!!page) {
      const offset = (page - 1) * 5;
      return INDIVIDUAL_AID.goFundMe.slice(offset, offset + 5);
    } else {
      return INDIVIDUAL_AID.goFundMe;
    }
  }

  const CAMPAIGNS = campaignSegments().map((aid) => gfmUrlToId(aid.link)).filter((id) => id !== null);

  const campaignDataPromises = CAMPAIGNS.map((campaign) =>
    getGFMCampaignData(campaign)
  );

  const campaignData = await Promise.all(campaignDataPromises).then(
    (data) => data
  );

  return campaignData;
}
