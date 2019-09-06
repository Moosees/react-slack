import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Spinner = () => (
  <Dimmer active>
    <Loader size="huge" content={'Loading chat...'} />
  </Dimmer>
);

export default Spinner;
