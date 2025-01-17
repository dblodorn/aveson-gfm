import type { NextApiRequest, NextApiResponse } from "next";
import { getAllCampaigns, CampaignData } from "../../lib/getGFMCampaignData";

export default async function handler(_: NextApiRequest, res: NextApiResponse<CampaignData[]>) {
  const campaignData = await getAllCampaigns();
  
  res.status(200).json(campaignData);
}
