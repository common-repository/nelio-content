import type { FieldSettingProps } from './types';

import { PostTypeSetting } from './post-type-setting';
import { CloudNotificationEmailsSetting } from './cloud-notification-emails-setting';
import { GoogleAnalyticsSetting } from './google-analytics-setting';

export const fields: Record<
	string,
	( props: FieldSettingProps ) => JSX.Element
> = {
	PostTypeSetting,
	CloudNotificationEmailsSetting,
	GoogleAnalyticsSetting,
};
