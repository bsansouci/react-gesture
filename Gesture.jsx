// Lol sorry I need that to iterate
/*eslint-disable */

import React from 'react';

React.initializeTouchEvents(true);
let Gesture = React.createClass({
  getInitialState() {
    return {
      touchDown: false,
      touchPosition: [0, 0],
      startPosition: [0, 0],
      velocity: [0, 0],
      prevTime: 0,
      flick: false
    };
  },

  componentWillMount() {
    document.body.addEventListener('touchstart', this.handleTouchStart);
    document.body.addEventListener('touchend', this.handleEnd);
    document.body.addEventListener('touchmove', this.handleTouchMove);
    document.body.addEventListener('touchcancel', this.handleTouchCancel);

    document.body.addEventListener('mousedown', this.handleMouseDown);
    document.body.addEventListener('mouseup', this.handleEnd);
    document.body.addEventListener('mousemove', this.handleMouseMove);

    // this.raf();
  },

  // TODO: Do we actually need this?
  // raf() {
  //   let {touchDown, flick} = this.state;
  //   if(!touchDown && flick) {
  //     this.setState({
  //       flick: false,
  //       velocity: [0, 0]
  //     });
  //   }
  //   requestAnimationFrame(this.raf);
  // },

  componentDidUpdate() {
    let {touchDown, flick} = this.state;
    if(!touchDown && flick) {
      this.setState({
        flick: false,
        velocity: [0, 0]
      });
    }
  },

  handleTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();

    this.handleMouseMove(e.touches[0]);

    return false;
  },

  handleTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();

    this.handleMouseDown(e.touches[0]);

    return false;
  },

  handleTouchCancel(e) {
    console.log("handleTouchCancel -->", e);
  },

  handleEnd() {
    let {velocity: [vx, vy]} = this.state;
    const size = Math.sqrt(vx * vx + vy * vy);
    const flick = size > 0.5 && size < 10; // test out these

    if(flick) console.log("flick", [vx, vy]);

    this.setState(() => {
      return {
        touchDown: false,
        flick: flick,
        startPosition: [0, 0],
      };
    });
    this.forceUpdate();
  },

  handleMouseMove(e) {
    if(e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    let {pageX, pageY} = e;

    let {touchDown, touchPosition: [x, y], prevTime} = this.state;
    if(!touchDown || (x === 0 && y === 0)) {
      this.setState({
        touchPosition: [pageX, pageY],
        startPosition: [pageX, pageY],
        deltaPos: [0, 0],
        prevTime: Date.now(),
        flick: false,
        velocity: [0, 0],
      });

      return false;
    }

    const dt = Date.now() - prevTime;
    const dx = x - pageX;
    const dy = y - pageY;
    const vx = dx / dt;
    const vy = dy / dt;

    this.setState({
      touchPosition: [pageX, pageY],
      deltaPos: [dx, dy],
      velocity: [vx, vy],
      prevTime: Date.now(),
      flick: false,
    });

    return false;
  },

  handleMouseDown(e) {
    if(e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    let {pageX, pageY} = e;
    this.setState({
      touchPosition: [pageX, pageY],
      startPosition: [pageX, pageY],
      deltaPos: [0, 0],
      touchDown: true,
      flick: false
    });

    return false;
  },

  render() {
    let {
      velocity,
      flick,
      touchDown,
      touchPosition: [pageX, pageY],
      startPosition: [startX, startY],
    } = this.state;

    if(flick) {
      window.hackOn = true;
      console.log('flick was true in Gesture');
    } else {
      // window.hackOn = false;
    }

    return this.props.children(touchDown, [pageX - startX, pageY - startY], velocity, flick);
  }
});

export default Gesture;