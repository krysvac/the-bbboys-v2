import {Poll} from './poll';
import {Choice} from './choice';

export interface PollWithChoices {
  poll: Poll,
  choices: Choice[]
}
