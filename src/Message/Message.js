import classNames from "classnames/dedupe";

/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import PropTypes from "prop-types";

import BindMixin from "../Mixin/BindMixin";
import Util from "../Util/Util";

class Message extends Util.mixin(BindMixin) {
  constructor() {
    super(...arguments);

    this.dismissMessage = this.dismissMessage.bind(this);
  }

  dismissMessage() {
    const { props } = this;
    if (props.dismissible) {
      props.onDismiss();
    }
  }

  getDismissButton() {
    return (
      <a
        className="message-dismissible-indicator"
        data-dismiss="alert"
        aria-label="Close"
        onClick={this.dismissMessage}
      >
        <span aria-hidden="true">×</span>
      </a>
    );
  }

  getMessage() {
    const { props } = this;

    const className = {
      message: "message",
      state: props.state || "",
      dismissible: props.dismissible ? "message-dismissible" : "",
      custom: props.customClass || ""
    };

    return (
      <div
        className={classNames(
          className.message,
          className.state,
          className.dismissible,
          className.custom
        )}
        ref="messageNode"
      >
        {this.getMessageContent()}
      </div>
    );
  }

  getMessageContent() {
    const { props } = this;

    return (
      <div>
        {props.dismissible && this.getDismissButton()}
        {props.children}
      </div>
    );
  }

  render() {
    const message = this.getMessage();

    return { message };
  }
}

Message.defaultProps = {
  dismissible: false,
  onDismiss: () => {},

  // Default classes.
  state: "message",
  customClass: null
};

Message.propTypes = {
  // Optionally enable the message to be dismissable
  dismissible: PropTypes.bool,
  // Method to execute on dismiss clicked
  onDismiss: PropTypes.func,
  // The content to render within the message
  children: PropTypes.node,

  // Default classes.
  state: PropTypes.string,
  customClass: PropTypes.string
};

module.exports = Message;
