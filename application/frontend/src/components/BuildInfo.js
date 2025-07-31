import React from 'react';
import '../css/BuildInfo.css';

const BuildInfo = () => {
  const gitCommitHash = process.env.REACT_APP_GIT_COMMIT_HASH || 'unknown';
  const gitCommitShort = process.env.REACT_APP_GIT_COMMIT_SHORT || 'unknown';
  const buildTime = process.env.REACT_APP_BUILD_TIME || 'unknown';

  if (gitCommitShort === 'unknown') {
    return null; // Don't render if no git info available
  }

  return (
    <div className="build-info">
      <span className="commit-hash" title={`Full hash: ${gitCommitHash}\nBuild time: ${buildTime}`}>
        {gitCommitShort}
      </span>
    </div>
  );
};

export default React.memo(BuildInfo);