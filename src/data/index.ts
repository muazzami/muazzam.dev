import siteJson from './site.json';
import homeJson from './pages/home.json';
import type { SiteData, HomePage } from './content';

export const site: SiteData = siteJson;
export const home: HomePage = homeJson;
export type * from './content';
