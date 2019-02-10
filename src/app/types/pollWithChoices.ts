import {Poll} from './poll';
import {Choice} from './poll_choice';

export interface PollWithChoices {
    poll: Poll,
    choices: Choice[]
}
