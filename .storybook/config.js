import { configure } from '@kadira/storybook';
import '../client/main.scss';

function loadStories() {
  require('../imports/ui/components/.stories');
}

configure(loadStories, module);
