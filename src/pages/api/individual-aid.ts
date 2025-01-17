import type { NextApiRequest, NextApiResponse } from "next";

import { parseAidCSV } from "../../lib/parseAidCSV";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  const individualAid = parseAidCSV();
  
  res.status(200).json({
    individualAid,
    gfmCampaignCount: individualAid.gfmUris.length,
  });
}
