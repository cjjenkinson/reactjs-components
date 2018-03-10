jest.dontMock("../Message");
jest.dontMock("../../Util/Util");

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var TestUtils;
if (React.version.match(/15.[0-5]/)) {
  TestUtils = require("react-addons-test-utils");
} else {
  TestUtils = require("react-dom/test-utils");
}

const Message = require("../Message");

describe("Message", function() {
  describe("Base", function() {
    beforeEach(function() {
      this.instance = TestUtils.renderIntoDocument(
        <Message state="message-success">
          <strong>Success:</strong>
          I am a succesfull message instance
        </Message>
      );
    });
    it("Should render with the intended state", function() {
      expect(
        this.instance.refs.messageNode.classList.contains("message-success")
      ).toBeTruthy();
    });

    it("Should render content with intended state", function() {
      expect(
        this.instance.refs.messageNode.textContent.contains(
          "I am a succesfull message instance"
        )
      ).toBeTruthy();
    });

    it("Should render with custom class when provided", function() {
      this.instance = TestUtils.renderIntoDocument(
        <Message state="message-success" customClass="message-success-custom">
          <strong>Success:</strong>
          I am a succesfull message instance
        </Message>
      );

      expect(
        this.instance.refs.tooltipNode.classList.contains(
          "message-success-custom"
        )
      ).toBeTruthy();
    });
  });

  describe("Dismissible", function() {
    beforeEach(function() {
      this.onDismiss = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <Message
          state="message-success"
          dismissible={true}
          onDismiss={this.onDismiss}
        >
          <strong>Success:</strong>
          I am a succesfull dismissible message instance
        </Message>
      );
    });

    it("Should render with dismissible class name if enabled", function() {
      expect(
        this.instance.refs.tooltipNode.classList.contains("message-dismissible")
      ).toBeTruthy();
    });

    it("Should call onDismiss", function() {
      this.instance.dismissMessage();
      expect(this.onDismiss).toHaveBeenCalled();
    });

    it("Should not contain dismissible class name when disabled", function() {
      expect(
        this.instance.refs.tooltipNode.classList.contains("message-dismissible")
      ).toEqual(false);
    });

    it("Should not call onDismiss when disabled", function() {
      this.instance.dismissMessage();
      expect(this.onDismiss).not.toHaveBeenCalled();
    });
  });
});
