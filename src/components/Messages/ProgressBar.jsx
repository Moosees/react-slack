import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ percentUploaded }) => (
  <Progress
    progress
    indicating
    inverted
    className="progress-bar"
    percent={percentUploaded}
  />
);

export default ProgressBar;
