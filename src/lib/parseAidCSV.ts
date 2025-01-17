import { INDIVIDUAL_AID } from "../consts/campaigns";

export const gfmUrlToId = (uri: string) => {
  const match = uri.match(/gofundme.com\/f\/(.*)/);

  // Remove trailing query string if present
  if (match && match[1].includes("?")) {
    match[1] = match[1].split("?")[0];
  }

  // Only return the ID
  return match ? match[1] : null;
}

export function parseAidCSV() {
  const gfmUris = INDIVIDUAL_AID.goFundMe.map((aid) => {
    const uri = aid.link;
    return {
      id: gfmUrlToId(uri),
      uri,
    };
  });
  
  
  const nonGfmUris = INDIVIDUAL_AID.otherAid.map((aid) => aid.link);
  
  return {
    gfmUris,
    nonGfmUris,
  };
}

export const gfmIds = () => parseAidCSV().gfmUris.map((aid) => aid.id);