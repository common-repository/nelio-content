export * from './preview';
export * from './synching';
export * from './ui';

import type { PreviewAction } from './preview';
import type { SynchingAction } from './synching';
import type { UIAction } from './ui';

export type StatusAction = PreviewAction | SynchingAction | UIAction;
