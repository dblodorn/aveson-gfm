import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAllCampaigns,
  CampaignDataWithFunding,
} from "../../lib/getGFMCampaignData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CampaignDataWithFunding[]>
) {
  const { page } = req.query;
  const campaignData = await getAllCampaigns(Number(page) || undefined);
  res.status(200).json(campaignData);
}
