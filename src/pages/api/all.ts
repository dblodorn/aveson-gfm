import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAllCampaigns,
  CampaignDataWithFunding,
} from "../../lib/getGFMCampaignData";

export const maxDuration = 60;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CampaignDataWithFunding[]>
) {
  const { page } = req.query;
  const campaignData = await getAllCampaigns(Number(page) || undefined);
  
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=240, stale-while-revalidate=1200"
  );
  
  res.status(200).json(campaignData);
}
