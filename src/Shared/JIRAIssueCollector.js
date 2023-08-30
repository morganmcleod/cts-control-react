import React from 'react';
import jQuery from 'jquery';
import MenuItem from '@mui/material/MenuItem';

const ELEMENT_ID = 'jira-feedback-button';
const WINDOW_VAR_NAME = 'jiraIssueCollector';
window['ATL_JQ_PAGE_PROPS'] = {
  "triggerFunction": function(showCollectorDialog) {
    jQuery(`#${ELEMENT_ID}`).click(function(e) {
      console.log('triggerFunction')
      e.preventDefault();
      showCollectorDialog();
    });
  },
  fieldValues: {
    'summary' : 'Bug report from CTS',
    'components' : '11219',
    'assignee' : 'Morgan McLeod',
    'priority' : '10000'
  }
};

export default function JIRAIssueCollector() {
  const setCollector = () => {
    window.jQuery = jQuery;
    const appElement = document.querySelector('body');
    if (appElement) {
      console.log('loading issue collector');
      const snippet = document.createElement('script');
      snippet.type = 'text/javascript';
      snippet.src = "https://nrao-ntc.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/5/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=10dc0aa6";
      appElement.appendChild(snippet);
    }
  };

  if (!window[WINDOW_VAR_NAME]) {
    setCollector();
    window[WINDOW_VAR_NAME] = this;
  }

  return (
    <MenuItem id={ELEMENT_ID}>
      Bug Report
    </MenuItem>
  );
};