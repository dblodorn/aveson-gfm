import type { NextApiRequest, NextApiResponse } from "next";
import { getGFMCampaignData, CampaignData } from "../../lib/getGFMCampaignData";

import { CAMPAIGNS } from "../../consts/campaigns";

export default async function handler(_: NextApiRequest, res: NextApiResponse<CampaignData[]>) {
  const campaignDataPromises = CAMPAIGNS.map((campaign) =>
    getGFMCampaignData(campaign)
  );

  const campaignData = await Promise.all(campaignDataPromises).then(
    (data) => data
  );
  
  res.status(200).json(campaignData);
}
