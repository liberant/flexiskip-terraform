import _ from 'lodash';
import * as statuses from '../../common/constants/bin-statuses';

const notCollectedItems =
  items => _.filter(items, item => item.binStatus !== statuses.STATUS_NOT_COLLECTED);

export { notCollectedItems };
