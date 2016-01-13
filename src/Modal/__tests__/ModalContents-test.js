var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../ModalContents');
jest.dontMock('../../Util/DOMUtil');

var ModalContents = require('../ModalContents');

describe('ModalContents', function () {

  beforeEach(function () {
    document.body.classList = {
      add: function () {},
      remove: function () {},
      toggle: function () {}
    };
  });

  describe('#getModal', function () {
    it('should return null if modal is not open', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={false} />
      );

      expect(instance.getModal()).toEqual(null);
    });

    it('should return an element if modal is open', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );

      var modal = instance.getModal();
      expect(TestUtils.isElement(modal)).toEqual(true);
    });
  });

  describe('#onClose', function () {
    beforeEach(function () {
      this.onClose = jasmine.createSpy();
      this.instance = TestUtils.renderIntoDocument(
        <ModalContents
          onClose={this.onClose}
          open={true}
          closeByBackdropClick={true}/>
      );
    });

    it('should not call onClose before the modal closes', function () {
      expect(this.onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when the modal closes', function () {
      this.instance.closeModal();
      expect(this.onClose).toHaveBeenCalled();
    });

    describe('#handleBackdropClick', function () {
      it('should call onClose', function () {
        this.instance.handleBackdropClick();
        expect(this.onClose).toHaveBeenCalled();
      });

      it('does not call onClose if closeByBackdropClick is false', function () {
        var instance = TestUtils.renderIntoDocument(
          <ModalContents onClose={this.onClose}
            open={true}
            closeByBackdropClick={false} />
        );

        instance.handleBackdropClick();
        expect(this.onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('#getFooter', function () {
    it('should not return a footer if disabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents showFooter={false} />
      );

      expect(instance.getFooter()).toEqual(null);
    });

    it('should return a footer if enabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents showFooter={true} />
      );

      var footer = instance.getFooter();
      expect(TestUtils.isElement(footer)).toEqual(true);
    });
  });

  describe('#getBackdrop', function () {
    it('should not return a backdrop when closed', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={false} />
      );

      expect(instance.getBackdrop()).toEqual(null);
    });

    it('should return a backdrop when open', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );

      var backdrop = instance.getBackdrop();
      expect(TestUtils.isElement(backdrop)).toEqual(true);
    });
  });

  describe('#getCloseButton', function () {
    it('should not return a button if disabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents showCloseButton={false} />
      );

      expect(instance.getCloseButton()).toEqual(null);
    });

    it('should return a button if enabled', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents showCloseButton={true} />
      );

      var closeButton = instance.getCloseButton();
      expect(TestUtils.isElement(closeButton)).toEqual(true);
    });
  });

  describe('#handleWindowResize', function () {
    it('should call forceUpdate on resize', function () {
      var instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );

      instance.forceUpdate = jasmine.createSpy();
      instance.handleWindowResize();
      expect(instance.forceUpdate).toHaveBeenCalled();
    });
  });

  describe('#calculateModalHeight', function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );

      // Mock height calculation
      this.mockHeight = {};
      this.instance.getInnerContainerHeightInfo = function () {
        return this.mockHeight;
      }.bind(this);
    });

    it('should default to auto height on invalid input', function () {
      var calculatedHeight = this.instance.calculateModalHeight();
      expect(calculatedHeight.height).toEqual('auto');
    });

    it('should default to auto contentHeight on invalid input', function () {
      var calculatedHeight = this.instance.calculateModalHeight();
      expect(calculatedHeight.contentHeight).toEqual('auto');
    });

    it('should not give a height that is bigger than maxHeight', function () {
      this.mockHeight = {
        innerHeight: 500,
        originalHeight: 600,
        outerHeight: 100,
        maxHeight: 500,
        totalContentHeight: 800
      };

      var calculatedHeight = this.instance.calculateModalHeight();
      var headerAndFooterHeight =
        this.mockHeight.totalContentHeight - this.mockHeight.originalHeight;

      expect(calculatedHeight.height)
        .toEqual(this.mockHeight.maxHeight - headerAndFooterHeight);

      expect(calculatedHeight.contentHeight)
        .toEqual(calculatedHeight.height - this.mockHeight.outerHeight);
    });

    it('should return originalHeight if smaller than maxHeight', function () {
      this.mockHeight = {
        innerHeight: 500,
        originalHeight: 600,
        outerHeight: 100,
        maxHeight: 1000,
        totalContentHeight: 800
      };

      var calculatedHeight = this.instance.calculateModalHeight();

      expect(calculatedHeight.height).toEqual(this.mockHeight.originalHeight);
      expect(calculatedHeight.innerHeight).toEqual(this.mockHeight.contentHeight);
    });
  });

  describe('#checkContentHeightChange', function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <ModalContents open={true} />
      );
    });

    it('should update the heightInfo with the difference between content',
      function () {
        var prevHeightInfo = {innerContentHeight: 200};
        var heightInfo = {
          innerContentHeight: 300,
          contentHeight: 400,
          height: 500,
          maxHeight: 1000
        };

        this.instance.checkContentHeightChange(prevHeightInfo, heightInfo);

        // Adds the difference between the innerContentHeights to contentHeight
        // and height.
        expect(heightInfo.contentHeight).toEqual(500);
        expect(heightInfo.height).toEqual(600);
      }
    );

    it('should update the heightInfo if maxHeight gets bigger', function () {
      var prevHeightInfo = {innerContentHeight: 600, maxHeight: 400};
      var heightInfo = {
        innerContentHeight: 600,
        maxHeight: 500,
        contentHeight: 350,
        height: 400
      };

      this.instance.checkContentHeightChange(prevHeightInfo, heightInfo);

      // Adds the difference between the maxHeights to contentHeight and height.
      expect(heightInfo.contentHeight).toEqual(450);
      expect(heightInfo.height).toEqual(500);
    });
  });

  describe('overflow hidden on body', function () {
    beforeEach(function () {
      document.body.classList = {
        add: jasmine.createSpy(),
        remove: jasmine.createSpy(),
        toggle: jasmine.createSpy()
      };

      this.node = document.createElement('div');
    });

    it('should toggle no-overflow on body when updated to open', function () {
      React.render(<ModalContents open={false} />, this.node);
      React.render(<ModalContents open={true} />, this.node);

      expect(document.body.classList.toggle)
        .toHaveBeenCalledWith('no-overflow');
    });

    it('should toggle no-overflow on body when updated to close', function () {
      React.render(<ModalContents open={true} />, this.node);
      React.render(<ModalContents open={false} />, this.node);

      expect(document.body.classList.toggle)
        .toHaveBeenCalledWith('no-overflow');
    });

    it('should add no-overflow on body when mounted open', function () {
      React.render(<ModalContents open={true} />, this.node);

      expect(document.body.classList.add).toHaveBeenCalledWith('no-overflow');
    });

    it('should not change class on body when mounted close', function () {
      React.render(<ModalContents open={false} />, this.node);

      expect(document.body.classList.toggle).not.toHaveBeenCalledWith();
      expect(document.body.classList.add).not.toHaveBeenCalledWith();
      expect(document.body.classList.remove).not.toHaveBeenCalledWith();
    });

    it('should remove no-overflow on body when unmounted', function () {
      React.render(<ModalContents open={true} />, this.node);
      React.render(<div />, this.node);

      expect(document.body.classList.remove).toHaveBeenCalledWith('no-overflow');
    });
  });
});
