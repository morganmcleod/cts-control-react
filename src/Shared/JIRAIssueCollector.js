import React, {useEffect} from 'react';
import jQuery from 'jquery';

const ELEMENT_ID = 'jira-feedback-button';
const WINDOW_VAR_NAME = 'jiraIssueCollector';

export default function JIRAIssueCollector(props) {
  const setCollector = () => {
    window.jQuery = jQuery;
    const appElement = document.querySelector('body');
    if (appElement) {
      const snippet = document.createElement('script');
      snippet.type = 'text/javascript';
      snippet.src = "https://nrao-ntc.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/5/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=10dc0aa6";
      appElement.appendChild(snippet);
    }
  };

  useEffect(() => {
    window['ATL_JQ_PAGE_PROPS'] = {
      "triggerFunction": function(showCollectorDialog) {
        jQuery(`#${ELEMENT_ID}`).on('click', function(e) {
          console.log('triggerFunction')
          e.preventDefault();
          showCollectorDialog();
        });
      },
      fieldValues: {
        'summary' : 'Bug report from CTS  [version ' + props.appVersion + ']',
        'components' : '11219',
        'assignee' : 'Morgan McLeod',
        'priority' : '10000'
      }
    };
  }, [props.appVersion]);

  if (!window[WINDOW_VAR_NAME]) {
    setCollector();
    window[WINDOW_VAR_NAME] = this;
  }

  return (
    <div id={ELEMENT_ID}>
      {props.children}
    </div>
  );
};
