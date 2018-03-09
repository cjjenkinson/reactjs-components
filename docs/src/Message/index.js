import React from 'react';

import CodeBlock from '../components/CodeBlock';
import ComponentExample from '../components/ComponentExample';
import ComponentExampleWrapper from '../components/ComponentExampleWrapper';
import ComponentWrapper from '../components/ComponentWrapper';
import PropertiesAPIBlock from '../components/PropertiesAPIBlock';
import Tooltip from '../../../src/Tooltip/Tooltip.js';

class MessageExample extends React.Component {
  render() {
    const messageContentBasic = (
      <p><strong>Information:</strong> This is a relevant message you should read</p>
    );

    const messageContentFull = (
      <h3 class="message-type-style">Some Important Headline</h3>
      <p>Cras justo odio</p>
      <a href="#" class="message-link">Sure, let's do that thing</a>
    );

    const dismissableOnCloseCallback = () => {
      return alert('Message dismissed!')
    }

    return (
      <ComponentWrapper
        title="Messages"
        srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Tooltip/Tooltip.js"
      >
        <p className="lead">
          Messages are an easy way to provide contextual messages or feedback related to a specific event, condition, or user action.
        </p>
        <p>
          Use messages in your project to convey information, provide tips, communicate success, or even flag and notify the user of errors. Wrap your message in an element with the class .message to apply the default message appearance. Any HTML can live inside a message, though content is typically limited to text and simple actions..
        </p>
        <PropertiesAPIBlock
          propTypesBlock={'PROPTYPES_BLOCK(src/Message/Message.js)'}
        />
        <ComponentExampleWrapper>
          <ComponentExample>
            <p>
              There are four different types of Messages
            </p>
          </ComponentExample>
          <CodeBlock>
            {`import {Message} from 'reactjs-components';
        import React from 'react';
            `}
          </CodeBlock>
        </ComponentExampleWrapper>
      </ComponentWrapper>
    );
  }
}

module.exports = MessageExample;
